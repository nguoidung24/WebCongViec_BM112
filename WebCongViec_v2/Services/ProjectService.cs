namespace WebCongViec_v2.Services
{
    public class ProjectService
    {
        public static string GetProjectName()
        {
            var configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();

            string connectionString = configuration.GetConnectionString("ProjectName");

            return connectionString;
        }

        public static string GetAXEHome()
        {
            var configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();

            string connectionString = configuration.GetConnectionString("AXEHOME");

            return connectionString;
        }
    }
}
