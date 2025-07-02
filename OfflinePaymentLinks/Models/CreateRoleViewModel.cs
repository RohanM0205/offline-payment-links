using System.ComponentModel.DataAnnotations;

namespace OfflinePaymentLinks.Models
{
    public class CreateRoleViewModel
    {
        [Required]
        [Display(Name = "Role Name")]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Role name can only contain letters, numbers, and underscores.")]
        public string RoleName { get; set; }
    }

}
