namespace OfflinePaymentLinks.Models
{
    public class UserWithRoleViewModel
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public bool IsApproved { get; set; }
        public string ApproverName { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string RoleName { get; set; }

    }

}
