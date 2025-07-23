using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebCongViec_v2.Controllers.Admin
{
    public class CapNhatNSController : Controller
    {
        [Route("/CapNhatNS")]
        public IActionResult CapNhatNS()
        {
            return View();
        }

        /*Sử dụng using ClosedXML.Excel;*/
        [HttpPost]
        [Route("/CapNhatNS")]
        public IActionResult CapNhatNS(IFormFile fileData)
        {
            if (fileData != null && fileData.Length > 0)
            {

                ViewBag.FileName = $"Chọn file: {fileData.FileName}";
            }
            else
            {
                ViewBag.FileName = "Không nhận được file nào.";
            }

            return View();
        }

    }
}
