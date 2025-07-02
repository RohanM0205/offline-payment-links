using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfflinePaymentLinks.Models;


namespace OfflinePaymentLinks.Controllers
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    public class AdminController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AdminController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // Get 
        [HttpGet]
        public async Task<IActionResult> AccessRequests(string? searchEmail)
        {
            var query = _userManager.Users
                .Where(u => u.IsApproved == false);

            bool searchPerformed = !string.IsNullOrWhiteSpace(searchEmail);
            List<ApplicationUser> pendingUsers;

            if (searchPerformed)
            {
                searchEmail = searchEmail.Trim();
                query = query.Where(u => EF.Functions.Like(u.Email, $"%{searchEmail}%"));
            }

            pendingUsers = query
                .OrderByDescending(u => u.RegistrationDate)
                .ToList();

            // ✅ Fetch all roles except SuperAdmin
            var availableRoles = await _roleManager.Roles
                .Where(r => r.Name != "SuperAdmin" && r.Name != "Admin")
                .Select(r => r.Name)
                .ToListAsync();

            // ✅ Pass data to view
            ViewBag.AvailableRoles = availableRoles;
            ViewBag.SearchEmail = searchEmail;
            ViewBag.SearchPerformed = searchPerformed;
            ViewBag.AnyFound = !searchPerformed || pendingUsers.Any();

            return View("~/Views/Dashboard/DashboardPages/AccessRequests.cshtml", pendingUsers);
        }

        // POST: /Admin/ApproveUser
        [HttpPost]
        public async Task<IActionResult> ApproveUser(string userId, string selectedRole)
        {
            if (string.IsNullOrEmpty(selectedRole))
            {
                TempData["ErrorMessage"] = "Please select a role before approving.";
                return RedirectToAction("AccessRequests");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                TempData["ErrorMessage"] = "User not found.";
                return RedirectToAction("AccessRequests");
            }

            var approver = await _userManager.GetUserAsync(User);

            user.IsApproved = true;
            user.Approveddate = DateTime.Now;
            user.ApproverName = approver?.Email ?? "System";

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                TempData["ErrorMessage"] = "Failed to update user.";
                return RedirectToAction("AccessRequests");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            // Remove all current roles
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                TempData["ErrorMessage"] = "Failed to remove user's existing roles.";
                return RedirectToAction("AccessRequests");
            }
            // Assign new role
            var roleAssignResult = await _userManager.AddToRoleAsync(user, selectedRole);
            if (!roleAssignResult.Succeeded)
            {
                TempData["ErrorMessage"] = $"Failed to assign role: {selectedRole}";
                return RedirectToAction("AccessRequests");
            }

            TempData["SuccessMessage"] = $"User approved and assigned role: {selectedRole}";
            return RedirectToAction("AccessRequests");
        }



        // POST: /Admin/DeleteUser
        [HttpPost]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                await _userManager.DeleteAsync(user);
            }
            return RedirectToAction("AccessRequests");
        }


        [HttpGet]
        public IActionResult CreateRole()
        {
            return View("~/Views/Dashboard/DashboardPages/CreateRole.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole(CreateRoleViewModel model)
        {
            if (!ModelState.IsValid)
                return View("~/Views/Dashboard/DashboardPages/CreateRole.cshtml", model);

            var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);
            if (roleExists)
            {
                TempData["ErrorMessage"] = "Role already exists.";
                return View("~/Views/Dashboard/DashboardPages/CreateRole.cshtml", model);
            }

            var result = await _roleManager.CreateAsync(new IdentityRole(model.RoleName));

            if (result.Succeeded)
            {
                TempData["SuccessMessage"] = "Role created successfully.";
                return RedirectToAction("CreateRole");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }

            return View("~/Views/Dashboard/DashboardPages/CreateRole.cshtml", model);
        }


    }
}
