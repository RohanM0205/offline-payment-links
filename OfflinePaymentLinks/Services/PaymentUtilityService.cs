using OfflinePaymentLinks.Data;

namespace OfflinePaymentLinks.Services
{
    public class PaymentUtilityService
    {
        private readonly ApplicationDbContext _context;
        private readonly Random _random;

        public PaymentUtilityService(ApplicationDbContext context)
        {
            _context = context;
            _random = new Random();
        }

        public (string JobRequestId, string PaymentReferenceNo, string InvoiceNo) GenerateUniquePaymentIds()
        {
            string datePart = DateTime.UtcNow.ToString("yyyyMMdd");

            // Different counters for each type to ensure uniqueness across types
            int jobReqCounter = _context.PrePaymentData.Count(p => p.JobRequestId != null) + 1;
            int paymentRefCounter = _context.PrePaymentData.Count(p => p.PaymentReferenceNo != null) + 1;
            int invoiceCounter = _context.PrePaymentData.Count(p => p.InvoiceNo != null) + 1;

            // JobRequestId: Starts with '122' and all numerical (12 digits total)
            string jobRequestId = $"122{datePart}{jobReqCounter.ToString("D3")}"; // 122 + yyyyMMdd + 3 digits

            // PaymentReferenceNo: Starts with '902' (15 digits total)
            string paymentRefNo = $"902{datePart}{_random.Next(1000, 9999)}"; // 902 + yyyyMMdd + random 4 digits

            // InvoiceNo: Starts with 'INVO' (15 characters total)
            string invoiceNo = $"INVO{datePart}{invoiceCounter.ToString("D3")}";

            return (jobRequestId, paymentRefNo, invoiceNo);
        }
    }

}
