namespace WebCongViec_v2.Services
{
    public class ConnectStringService
    {
        public static string Get()
        {
            var configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();

            string connectionString = configuration.GetConnectionString("ConnectionString");

            return connectionString;
        }
    }
}
