using OfflinePaymentLinks.Models;
using OfflinePaymentLinks.Repositories;

namespace OfflinePaymentLinks.Services
{
    public class GenericPaymentsFetchService
    {
        private readonly GenericPaymentsFetchRepository _repository;

        public GenericPaymentsFetchService(GenericPaymentsFetchRepository repository)
        {
            _repository = repository;
        }

        public KYCInformation FetchKYC(string kycId)
        {
            return _repository.GetKycById(kycId);
        }

        public PolicyInformation GetPolicyDetails(string policyNumber)
        {
            return _repository.GetPolicyByNumber(policyNumber);
        }

        public PolicyInformation ShortFallSearch(string inwardNumber = null, string customerId = null, string interactionId = null)
        {
            if (!string.IsNullOrWhiteSpace(inwardNumber))
            {
                return _repository.GetPolicyByInwardNumber(inwardNumber);
            }
            else if (!string.IsNullOrWhiteSpace(customerId))
            {
                return _repository.GetPolicyByCustomerId(customerId);
            }
            else if (!string.IsNullOrWhiteSpace(interactionId))
            {
                return _repository.GetPolicyByInteractionId(interactionId);
            }

            return null;
        }

        public PinCodeData GetPinCodeInformation(string pinCode)
        {
            return _repository.GetPinCodeDetails(pinCode);
        }


    }
}
