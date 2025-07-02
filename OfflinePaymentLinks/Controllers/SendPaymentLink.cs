using Microsoft.AspNetCore.Mvc;
using OfflinePaymentLinks.Data;
using OfflinePaymentLinks.Models;
using System.Threading.Tasks;
using System;
using System.Text.Json;

namespace OfflinePaymentLinks.Controllers
{
    public class SendPaymentLinkController : Controller
    {
        private readonly ApplicationDbContext _context;        

        public SendPaymentLinkController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult StorePrePaymentData([FromBody] PrePaymentData data)
        {
            TempData["PrePaymentData"] = JsonSerializer.Serialize(data); 
            return Ok();
        }

        [HttpGet]
        public IActionResult Index()
        {
            if (TempData["PrePaymentData"] is string json)
            {
                var model = JsonSerializer.Deserialize<PrePaymentData>(json);
                return View("~/Views/SendPaymentLink/Index.cshtml", model);
            }

            return RedirectToAction("Index", "PaymentForm"); // fallback
        }


        public class SendPaymentRequest
        {
            public PrePaymentData PrePaymentData { get; set; }
            public bool SendEmail { get; set; }
            public bool SendSms { get; set; }
        }

        [HttpPost("/SendPaymentLink/ProcessAndSend")]
        public async Task<IActionResult> ProcessAndSend([FromBody] SendPaymentRequest request)
        {
            if (request == null || request.PrePaymentData == null)
                return BadRequest("Invalid request");

            var data = request.PrePaymentData;
            data.CreatedDate = DateTime.Now;
            data.LastUpdated = DateTime.Now;
            

            _context.PrePaymentData.Add(data);
            await _context.SaveChangesAsync();

            bool emailSuccess = true, smsSuccess = true;

            if (request.SendEmail)
            {
                // Placeholder logic – replace with actual implementation
                emailSuccess = true;
                if (!emailSuccess) return StatusCode(500, "Email sending failed");
            }

            if (request.SendSms)
            {
                // Placeholder logic – replace with actual implementation
                smsSuccess = true;
                if (!smsSuccess) return StatusCode(500, "SMS sending failed");
            }

            return Ok(new { message = "Payment link processed and sent successfully." });
        }
    }
}
