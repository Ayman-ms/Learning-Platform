using System;
using System.IO;

public class ImageHelper
{
    public static string ConvertImageToBase64(string imagePath)
    {
        try
        {
            // قراءة الصورة كـ Byte Array
            byte[] imageBytes = File.ReadAllBytes(imagePath);

            // تحويل الصورة إلى سلسلة Base64
            string base64String = Convert.ToBase64String(imageBytes);

            return base64String;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return null;
        }
    }
}
