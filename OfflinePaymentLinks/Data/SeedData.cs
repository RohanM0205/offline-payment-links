using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using OfflinePaymentLinks.Models;
using System;
using System.Threading.Tasks;

namespace OfflinePaymentLinks.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Seed roles
            string[] roleNames = { "SuperAdmin", "Admin", "User" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Create Super Admin
            var superAdminEmail = "superadmin@offlinepaymentlinks.com";
            var superAdminUser = await userManager.FindByEmailAsync(superAdminEmail);
            if (superAdminUser == null)
            {
                superAdminUser = new ApplicationUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail,
                    EmailConfirmed = true,
                    IsApproved = true
                };

                var result = await userManager.CreateAsync(superAdminUser, "SuperAdmin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(superAdminUser, "SuperAdmin");
                }
            }
        }
    }
}