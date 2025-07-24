using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{

    public class CapNhatNSController : Controller 
    {
        protected CapNhatNSService capNhatNSService;

        public CapNhatNSController()
        {
            this.capNhatNSService = new CapNhatNSService();

        }

        [Route("/CapNhatNS")]
        public IActionResult CapNhatNS()
        {
            return View();
        }

        [HttpPost]
        [Route("/CapNhatNS")]
        public IActionResult CapNhatNS(IFormFile fileData)
        {
            (ViewBag.FileName, ViewBag.SuccessMessage, ViewBag.ErrorMessage, ViewBag.ExcelData) = this.capNhatNSService.getExcelData(fileData);  
            return View();
        }
    }
}
