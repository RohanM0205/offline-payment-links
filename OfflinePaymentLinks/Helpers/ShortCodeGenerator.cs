namespace OfflinePaymentLinks.Helpers
{
    public static class ShortCodeGenerator
    {
        private static readonly Random _random = new();
        private const string _chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public static string Generate(int length = 6)
        {
            return new string(Enumerable.Repeat(_chars, length)
                .Select(s => s[_random.Next(s.Length)]).ToArray());
        }
    }
}
