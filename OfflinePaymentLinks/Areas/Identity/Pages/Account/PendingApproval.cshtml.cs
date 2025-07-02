// PendingApproval.cshtml.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace OfflinePaymentLinks.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class PendingApprovalModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}