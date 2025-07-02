﻿using System.ComponentModel.DataAnnotations;

namespace OfflinePaymentLinks.Models
{
    public class PrePaymentData
    {
        [Key]
        public int Id { get; set; }
        public string PolicyNumber { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Salutation { get; set; }
        public string MobileNumber { get; set; }
        public string EmailId { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string PinCode { get; set; }
        public string Locality { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string KYC_ID { get; set; }
        public string PAN { get; set; }
        public DateTime? DOB { get; set; }
        public decimal? Amount { get; set; }
        public string CustomerType { get; set; }
        public string TransactionType { get; set; }
        public string ChannelType { get; set; }
        public string PaymentType { get; set; }
        public string InvoiceNo { get; set; }
        public string JobRequestId { get; set; }
        public string PaymentReferenceNo { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? LastUpdated { get; set; }
        public string KYC_Status { get; set; }
        public string KYC_Name { get; set; }
        public string Name_Mismatch_Status { get; set; }
        public string Nominee_Name { get; set; }
        public string Nominee_Relation { get; set; }
        public int? Nominee_Age { get; set; }
        public bool? isAutoRenewal { get; set; }
        public string Product { get; set; }
        public string ProductCode { get; set; }
        public string CusomerId { get; set; }
        public string InwardNumber { get; set; }
        public string InteractionId { get; set; }
        public DateTime? PolicyExpiryDate { get; set; }
        public string ServerIP { get; set; }
        public string PaymentLink { get; set; }
        public string RequestorEmails { get; set; }
        public string RequestorMobile { get; set; }
        public string Remarks { get; set; }
        public string? ShortUrl { get; set; }
        public DateTime? UrlExpiration { get; set; }
        public string UploadedFilesPath { get; set; }

    }
}
