using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfflinePaymentLinks.Data;
using OfflinePaymentLinks.Data;
using OfflinePaymentLinks.Models;

namespace OfflinePaymentLinks.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")] // Restrict to admin roles
    public class DashboardController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private const int PageSize = 10;

        public DashboardController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _context = context;
            _roleManager = roleManager;
        }

        public IActionResult Index()
        {
            return View("~/Views/Dashboard/Index.cshtml");
        }
        
        public IActionResult AddAdmin()
        {
            return View("~/Views/Dashboard/DashboardPages/AddAdmin.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> AddAdmin(AddAdminViewModel model)
        {
            var approver = await _userManager.GetUserAsync(User);
            if (!ModelState.IsValid)
                return View("~/Views/Dashboard/DashboardPages/AddAdmin.cshtml", model);

            // ✅ Duplicate email check before creating user
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                ModelState.AddModelError("Email", "An account with this email already exists.");
                return View("~/Views/Dashboard/DashboardPages/AddAdmin.cshtml", model);
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                EmailConfirmed = true,
                IsApproved = true,
                RegistrationDate = DateTime.Now,
                Approveddate = DateTime.Now,
                ApproverName = String.IsNullOrEmpty(approver.ToString()) ? "System" : approver.ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Admin");
                TempData["SuccessMessage"] = "Admin added successfully.";
                return View("~/Views/Dashboard/DashboardPages/AdminAdded.cshtml");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }

            return View("~/Views/Dashboard/DashboardPages/AddAdmin.cshtml", model);
        }


        public async Task<IActionResult> ViewAdmins(int pageNumber = 1, string? searchEmail = null)
        {
            var usersQuery = from user in _context.Users
                             join userRole in _context.UserRoles on user.Id equals userRole.UserId
                             join role in _context.Roles on userRole.RoleId equals role.Id
                             where new[] { "Admin" }.Contains(role.Name)
                                   && user.IsApproved == true
                             select new UserWithRoleViewModel
                             {
                                 UserId = user.Id,
                                 Email = user.Email,
                                 IsApproved = user.IsApproved,
                                 ApproverName = user.ApproverName,
                                 RegistrationDate = user.RegistrationDate,
                                 ApprovedDate = user.Approveddate,
                                 RoleName = role.Name
                             };

            if (!string.IsNullOrEmpty(searchEmail))
            {
                usersQuery = usersQuery.Where(u => u.Email.Contains(searchEmail));
                ViewBag.SearchEmail = searchEmail;
                ViewBag.SearchPerformed = true;
            }
            else
            {
                ViewBag.SearchPerformed = false;
            }

            // ✅ Sort by ApprovedDate descending
            usersQuery = usersQuery.OrderByDescending(u => u.ApprovedDate);

            var paginated = await PaginatedList<UserWithRoleViewModel>.CreateAsync(
                usersQuery.AsNoTracking(), pageNumber, PageSize);

            ViewBag.AnyFound = paginated.Any();

            return View("~/Views/Dashboard/DashboardPages/ViewUsers.cshtml", paginated);
        }



        public async Task<IActionResult> ViewUsers(int pageNumber = 1, string? searchEmail = null)
        {
            var usersQuery = from user in _context.Users
                             join userRole in _context.UserRoles on user.Id equals userRole.UserId
                             join role in _context.Roles on userRole.RoleId equals role.Id
                             where !new[] { "Admin", "SuperAdmin" }.Contains(role.Name)
                                   && user.IsApproved == true
                             select new UserWithRoleViewModel
                             {
                                 UserId = user.Id,
                                 Email = user.Email,
                                 IsApproved = user.IsApproved,
                                 ApproverName = user.ApproverName,
                                 RegistrationDate = user.RegistrationDate,
                                 ApprovedDate = user.Approveddate,
                                 RoleName = role.Name
                             };

            if (!string.IsNullOrEmpty(searchEmail))
            {
                usersQuery = usersQuery.Where(u => u.Email.Contains(searchEmail));
                ViewBag.SearchEmail = searchEmail;
                ViewBag.SearchPerformed = true;
            }
            else
            {
                ViewBag.SearchPerformed = false;
            }

            // ✅ Sort by ApprovedDate descending
            usersQuery = usersQuery.OrderByDescending(u => u.ApprovedDate);

            var paginated = await PaginatedList<UserWithRoleViewModel>.CreateAsync(
                usersQuery.AsNoTracking(), pageNumber, PageSize);

            ViewBag.AnyFound = paginated.Any();

            return View("~/Views/Dashboard/DashboardPages/ViewUsers.cshtml", paginated);
        }


        [HttpPost]
        public async Task<IActionResult> DeleteSelectedUsers(List<string> selectedUsers)
        {
            string firstUserId = selectedUsers.First();
            string userRole = string.Empty;
            var user1 = await _userManager.FindByIdAsync(firstUserId);
            if (user1 != null)
            {
                var roles = await _userManager.GetRolesAsync(user1);
                userRole = roles.FirstOrDefault();                
            }


            foreach (var userId in selectedUsers)
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    await _userManager.DeleteAsync(user);
                }
            }

            if (userRole == "Admin")
                return RedirectToAction("ViewAdmins");
            else
                return RedirectToAction("ViewUsers");
        }


        [HttpPost]
        public async Task<IActionResult> DeleteUser(string userId, string userRole)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                await _userManager.DeleteAsync(user);
            }
            //return RedirectToAction("ViewUsers");
            if (userRole == "Admin")
                return RedirectToAction("ViewAdmins");
            else
                return RedirectToAction("ViewUsers");
        }

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


    }

}
