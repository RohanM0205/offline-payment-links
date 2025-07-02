namespace OfflinePaymentLinks.Models
{
    public class PaymentFormModel
    {
        // Section 1
        public string ChannelType { get; set; }
        public string CustomerType { get; set; }
        public string TransactionType { get; set; }
        public string KycId { get; set; }
        public string PolicyNumber { get; set; }
        public string ShortfallSearchType { get; set; }
        public string ShortfallSearchValue { get; set; }

        // Section 2
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Salutation { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Pincode { get; set; }
        public string Locality { get; set; }
        public string City { get; set; }
        public string State { get; set; }

        // Section 3
        public string RequestorMobile { get; set; }
        public List<string> RequestorEmails { get; set; } = new List<string>();
        public string Product { get; set; }
        public decimal Amount { get; set; }
        public string Remarks { get; set; }
    }
}
