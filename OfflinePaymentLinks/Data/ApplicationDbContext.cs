using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OfflinePaymentLinks.Models;

namespace OfflinePaymentLinks.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<KYCInformation> KYC_Information { get; set; }
        public DbSet<PolicyInformation> PolicyInformation { get; set; }
        public DbSet<PinCodeData> PinCodeData { get; set; }
        public DbSet<UrlMapping> UrlMappings { get; set; }
        public DbSet<PrePaymentData> PrePaymentData { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<KYCInformation>().ToTable("KYC_Information");
            modelBuilder.Entity<KYCInformation>().HasKey(k => k.KYC_ID);

            modelBuilder.Entity<PolicyInformation>().ToTable("PolicyInformation");
            modelBuilder.Entity<PolicyInformation>().HasKey(p => p.PolicyNumber);

            modelBuilder.Entity<PinCodeData>().ToTable("PinCodeData");
            modelBuilder.Entity<PinCodeData>().HasKey(p => p.PinCode);

        }

    }

}