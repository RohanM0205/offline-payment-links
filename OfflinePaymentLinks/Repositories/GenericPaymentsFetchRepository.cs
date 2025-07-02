using OfflinePaymentLinks.Data;
using OfflinePaymentLinks.Models;

namespace OfflinePaymentLinks.Repositories
{
    public class GenericPaymentsFetchRepository
    {
        private readonly ApplicationDbContext _context;

        public GenericPaymentsFetchRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public KYCInformation GetKycById(string kycId)
        {
            return _context.KYC_Information.FirstOrDefault(k => k.KYC_ID == kycId);
        }

        public PolicyInformation GetPolicyByNumber(string policyNumber)
        {
            return _context.PolicyInformation.FirstOrDefault(p => p.PolicyNumber == policyNumber);
        }

        public PolicyInformation GetPolicyByInwardNumber(string inwardNumber)
        {
            return _context.PolicyInformation
                .FirstOrDefault(p => p.InwardNumber == inwardNumber);
        }

        public PolicyInformation GetPolicyByCustomerId(string customerId)
        {
            return _context.PolicyInformation
                .FirstOrDefault(p => p.CustomerId == customerId);
        }

        public PolicyInformation GetPolicyByInteractionId(string interactionId)
        {
            return _context.PolicyInformation
                .FirstOrDefault(p => p.InteractionId == interactionId);
        }

        public PinCodeData GetPinCodeDetails(string pinCode)
        {
            return _context.PinCodeData.FirstOrDefault(p => p.PinCode == pinCode);
        }


    }
}
