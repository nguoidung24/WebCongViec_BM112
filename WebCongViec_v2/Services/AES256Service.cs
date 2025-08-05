using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

public class AES256Service
{
    //static void Main()
    //{
    //    string plainText = "1";
    //    string keyText = "tdssohoa"; // key người dùng nhập

    //    // Mã hóa
    //    string encrypted = Encrypt(plainText, keyText);
    //    Console.WriteLine("Đã mã hóa: " + encrypted);

    //    // Giải mã
    //    string decrypted = Decrypt(encrypted, keyText);
    //    Console.WriteLine("Đã giải mã: " + decrypted);
    //}

    public  string Encrypt(string plainText, string password)
    {
        byte[] key = SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password)); // 32 bytes
        byte[] iv = Encoding.UTF8.GetBytes("1234567890abcdef"); // 16 bytes IV cố định

        using (Aes aes = Aes.Create())
        {
            aes.Key = key;
            aes.IV = iv;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var encryptor = aes.CreateEncryptor();
            byte[] inputBytes = Encoding.UTF8.GetBytes(plainText);
            byte[] encryptedBytes = encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);
            return Convert.ToBase64String(encryptedBytes);
        }
    }

    public  string Decrypt(string cipherText, string password)
    {
        if (string.IsNullOrEmpty(cipherText) || string.IsNullOrEmpty(password))
        {
            return "";
        }
        byte[] key = SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password));
        byte[] iv = Encoding.UTF8.GetBytes("1234567890abcdef");

        using (Aes aes = Aes.Create())
        {
            aes.Key = key;
            aes.IV = iv;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var decryptor = aes.CreateDecryptor();
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            byte[] decryptedBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
            return Encoding.UTF8.GetString(decryptedBytes);
        }
    }
}
