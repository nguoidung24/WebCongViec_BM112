using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebCongViec_v2.Services
{
    public class AXAService
    {
        public string? GetInfo(string name)
        {
            var configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();

            string? connectionString = configuration.GetConnectionString(name);

            return connectionString;
        }

        public async Task<string> GetTokenAsync()
        {
            string? username = this.GetInfo("axa-username");
            string? password = this.GetInfo("axa-password");

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Username or password is null or empty.");
            }

            using (var client = new HttpClient())
            {
                var url = $"{this.GetInfo("axa-url-login")}?Username={Uri.EscapeDataString(username)}&Password={Uri.EscapeDataString(password)}";
                var request = new HttpRequestMessage(HttpMethod.Post, url);

                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();

                try
                {
                    using JsonDocument doc = JsonDocument.Parse(responseBody);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("Data", out JsonElement dataElement) &&
                        dataElement.ValueKind != JsonValueKind.Null &&
                        dataElement.TryGetProperty("Token", out JsonElement tokenElement))
                    {
                        return tokenElement.GetString() ?? throw new Exception("Token is null");
                    }
                    else
                    {
                        throw new Exception("Token not found in response");
                    }
                }
                catch (JsonException ex)
                {
                    throw new Exception("Failed to parse JSON response", ex);
                }
            }
        }


            public async Task<string?> LayNSAsync( string URL, string ID, string GetOf)
            {
                using var client = new HttpClient();
                using var content = new MultipartFormDataContent();

                // Lấy token
                string token = await this.GetTokenAsync();

                // Gửi các form field
                content.Add(new StringContent(token), "Token");
                content.Add(new StringContent("[\""+ID+"\"]"), "Username");
                string today = DateTime.Now.ToString("dd/MM/yyyy");
                content.Add(new StringContent(today), "StartDate");
                content.Add(new StringContent(today), "EndDate");

                var request = new HttpRequestMessage(HttpMethod.Post, URL)
                {
                    Content = content
                };

                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine(responseBody); // In ra để debug nếu cần

                // Parse JSON
                try
                {
                    using JsonDocument doc = JsonDocument.Parse(responseBody);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("Data", out JsonElement dataElement) &&
                        dataElement.TryGetProperty("DATA", out JsonElement dataArray) &&
                        dataArray.ValueKind == JsonValueKind.Array &&
                        dataArray.GetArrayLength() > 0)
                    {
                        var firstItem = dataArray[0];
                        if (firstItem.TryGetProperty(GetOf, out JsonElement daQuetElement))
                        {
                            return daQuetElement.GetRawText();
                        }
                    }

                    return null; // Không có dữ liệu phù hợp
                }
                catch (JsonException ex)
                {
                    throw new Exception("Lỗi khi phân tích JSON trả về", ex);
                }
            }
        }
    }

