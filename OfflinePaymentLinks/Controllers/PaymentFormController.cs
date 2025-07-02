using System.IO.Compression;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfflinePaymentLinks.Data;
using OfflinePaymentLinks.Helpers;
using OfflinePaymentLinks.Models;
using OfflinePaymentLinks.Services;

namespace OfflinePaymentLinks.Controllers
{
    public class PaymentFormController : Controller
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly GenericPaymentsFetchService _service;
        private readonly ApplicationDbContext _context;
        private readonly PaymentUtilityService _paymentUtilityService;

        public PaymentFormController(
            UserManager<ApplicationUser> userManager,
            GenericPaymentsFetchService service,
            ApplicationDbContext context,
            PaymentUtilityService paymentUtilityService)
        {
            _userManager = userManager;
            _service = service;
            _context = context;
            _paymentUtilityService = paymentUtilityService;
        }


        [Authorize(Roles = "User,CEM,Admin,SuperAdmin")]
        public IActionResult Index()
        {
            return View("~/Views/PaymentForm/Index.cshtml");
        }

        [HttpGet("/PaymentForm/GetKycDetails/{kycId}")]
        public IActionResult GetKycDetails(string kycId)
        {
            var kycData = _service.FetchKYC(kycId);
            return kycData == null
                ? NotFound(new { message = "KYC ID not found" })
                : Ok(kycData);
        }

        [HttpGet("/PaymentForm/GetPolicyDetails/{policyNumber}")]
        public IActionResult GetPolicyDetails(string policyNumber)
        {
            var result = _service.GetPolicyDetails(policyNumber);
            return result == null
                ? NotFound(new { message = "Policy record not found." })
                : Ok(result);
        }

        [HttpGet("/PaymentForm/ShortFallSearch")]
        public IActionResult ShortFallSearch([FromQuery] string inwardNumber, [FromQuery] string customerId, [FromQuery] string interactionId)
        {
            var paramCount = new[] { inwardNumber, customerId, interactionId }
                .Count(p => !string.IsNullOrWhiteSpace(p));

            if (paramCount != 1)
            {
                return BadRequest(new
                {
                    message = "Please provide exactly one search parameter (InwardNumber, CustomerId, or InteractionId)"
                });
            }

            var result = _service.ShortFallSearch(inwardNumber, customerId, interactionId);
            return result == null
                ? NotFound(new { message = "No policy record found with the provided search criteria." })
                : Ok(result);
        }

        [HttpGet("/PaymentForm/GetLocationByPinCode/{pinCode}")]
        public IActionResult GetLocationByPinCode(string pinCode)
        {
            if (string.IsNullOrWhiteSpace(pinCode) || pinCode.Length != 6 || !pinCode.All(char.IsDigit))
            {
                return BadRequest(new { message = "Please provide a valid 6-digit pin code." });
            }

            var result = _service.GetPinCodeInformation(pinCode);
            return result == null
                ? NotFound(new { message = "Pin code not found in our database." })
                : Ok(new { result.Locality, result.City, result.State });
        }

        [HttpPost]
        public IActionResult GeneratePaymentLink([FromBody] PaymentLinkRequest model)
        {
            if (string.IsNullOrWhiteSpace(model.TransactionType) || string.IsNullOrWhiteSpace(model.JobRequestId))
                return BadRequest("Transaction Type and JobRequestId are required.");

            string baseUrl = "https://infiniota.com/OfflinePaymentsClicks";

            string endpoint = (model.TransactionType == "NB" || model.TransactionType == "RL")
                                ? "PaymentSummary"
                                : "KYCDataCompare";

            string fullUrl = $"{baseUrl}/{endpoint}?jobId={model.JobRequestId}";

            return Ok(new { PaymentUrl = fullUrl });
        }

        [HttpPost("/PaymentForm/SendPaymentEmail")]
        public async Task<IActionResult> SendPaymentEmail([FromQuery] string email, [FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(url))
                return BadRequest(new { message = "Email and URL are required." });

            //var success = await _emailService.SendPaymentEmailAsync(email, url);
            var success = true;

            if (success)
                return Ok(new { message = "Email sent successfully." });
            else
                return StatusCode(500, new { message = "Failed to send email." });
        }

        [HttpPost("/PaymentForm/SendPaymentSMS")]
        public async Task<IActionResult> SendPaymentSMS([FromQuery] string mobile, [FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(mobile) || string.IsNullOrWhiteSpace(url))
                return BadRequest(new { message = "Email and URL are required." });

            //var success = await _emailService.SendPaymentEmailAsync(mobile, url);
            //SMS API Implementation Pending
            var success = true;

            if (success)
                return Ok(new { message = "SMS sent successfully." });
            else
                return StatusCode(500, new { message = "Failed to send SMS." });
        }

        //[HttpPost("/PaymentForm/InsertPrePaymentData")]
        //public async Task<IActionResult> InsertPrePaymentData([FromBody] PrePaymentData data)
        //{
        //    if (data == null)
        //        return BadRequest("Invalid input");

        //    data.CreatedDate = DateTime.Now;
        //    data.LastUpdated = DateTime.Now;

        //    _context.PrePaymentData.Add(data);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Data inserted successfully" });
        //}

        [HttpPost("/PaymentForm/GenerateShortPaymentLink")]
        public async Task<IActionResult> GenerateShortPaymentLink([FromBody] PaymentLinkRequest model)
        {
            if (string.IsNullOrWhiteSpace(model.TransactionType))
                return BadRequest(new { message = "TransactionType is required." });

            // Step 1: Generate IDs
            var ids = _paymentUtilityService.GenerateUniquePaymentIds();
            var jobRequestId = ids.JobRequestId;

            // Step 2: Generate long URL
            var linkRequest = new PaymentLinkRequest
            {
                JobRequestId = jobRequestId,
                TransactionType = model.TransactionType
            };

            var linkResponse = GeneratePaymentLink(linkRequest) as OkObjectResult;
            if (linkResponse == null || linkResponse.Value == null)
                return StatusCode(500, new { message = "Failed to generate payment link." });

            var longUrl = ((dynamic)linkResponse.Value).PaymentUrl as string;

            if (!Uri.IsWellFormedUriString(longUrl, UriKind.Absolute))
                return BadRequest(new { message = "Generated URL is invalid." });

            // Step 3: Check for existing shortened URL
            var existing = await _context.UrlMappings
                .FirstOrDefaultAsync(u => u.OriginalUrl == longUrl && u.ExpiryDate > DateTime.UtcNow);

            if (existing != null)
            {
                return Ok(new
                {
                    jobRequestId,
                    shortUrl = existing.ShortUrl,
                    invoiceNo = ids.InvoiceNo,
                    paymentReferenceNo = ids.PaymentReferenceNo
                });
            }

            // Step 4: Generate short code
            string shortCode;
            do
            {
                shortCode = ShortCodeGenerator.Generate();
            } while (await _context.UrlMappings.AnyAsync(u => u.ShortCode == shortCode));

            var shortUrl = $"https://infiniota.com/{shortCode}";

            _context.UrlMappings.Add(new UrlMapping
            {
                OriginalUrl = longUrl,
                ShortCode = shortCode,
                ShortUrl = shortUrl,
                ExpiryDate = DateTime.UtcNow.AddHours(24)
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                jobRequestId,
                shortUrl,
                invoiceNo = ids.InvoiceNo,
                paymentReferenceNo = ids.PaymentReferenceNo
            });
        }


        [HttpPost("/PaymentForm/UploadAndZipFiles")]
        public async Task<IActionResult> UploadAndZipFiles([FromForm] string invoiceNumber, [FromForm] List<IFormFile> files)
        {
            try
            {
                if (string.IsNullOrEmpty(invoiceNumber))
                    return BadRequest("Invoice number is required.");

                if (files == null || files.Count == 0)
                    return BadRequest("No files uploaded.");

                if (files.Count > 4)
                    return BadRequest("Maximum 4 files allowed.");

                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
                Directory.CreateDirectory(rootPath);

                string folderPath = Path.Combine(rootPath, invoiceNumber);
                Directory.CreateDirectory(folderPath);

                foreach (var file in files)
                {
                    var filePath = Path.Combine(folderPath, file.FileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }

                string zipPath = Path.Combine(rootPath, $"{invoiceNumber}.zip");
                if (System.IO.File.Exists(zipPath))
                    System.IO.File.Delete(zipPath);

                ZipFile.CreateFromDirectory(folderPath, zipPath);
                Directory.Delete(folderPath, true);

                return Ok(new { zipPath });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }


    }
}
