using System.Security.Cryptography;
using System.Text;

namespace WebCongViec_v2.Services
{
    public class AES256Service
    {
        private static byte[] CreateKey(string password)
        {
            using (SHA256 sha = SHA256.Create())
            {
                return sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public static string Encrypt(string plainText, string password)
        {
            byte[] key = CreateKey(password);
            byte[] iv = new byte[16]; 

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.KeySize = 256;
                aesAlg.BlockSize = 128;
                aesAlg.Key = key;
                aesAlg.IV = iv;
                /*=================== MODE ============================*/
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream ms = new MemoryStream())
                using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                using (StreamWriter sw = new StreamWriter(cs))
                {
                    sw.Write(plainText);
                    sw.Close();
                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }

        public static string Decrypt(string cipherText, string password)
        {
            byte[] key = CreateKey(password);
            byte[] iv = new byte[16]; 

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.KeySize = 256;
                aesAlg.BlockSize = 128;
                aesAlg.Key = key;
                aesAlg.IV = iv;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                byte[] buffer = Convert.FromBase64String(cipherText);

                using (MemoryStream ms = new MemoryStream(buffer))
                using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                using (StreamReader sr = new StreamReader(cs))
                {
                    return sr.ReadToEnd();
                }
            }
        }

        static void Main()
        {
            string original = "Nội dung cần mã hóa";
            string password = "matkhaubimat123";

            string encrypted = Encrypt(original, password);
            Console.WriteLine("Đã mã hóa: " + encrypted);

            string decrypted = Decrypt(encrypted, password);
            Console.WriteLine("Đã giải mã: " + decrypted);
        }
    }
}
