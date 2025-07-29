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
            if(fileData != null && fileData.Length > 0)
            {
               this.capNhatNSService.ExportChamCongToSQL(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "chamcong.sql"));
            }
        
            (ViewBag.FileName, ViewBag.SuccessMessage, ViewBag.ErrorMessage, ViewBag.ExcelData) = this.capNhatNSService.getExcelData(fileData);  
            ViewBag.NhanSuList = this.capNhatNSService.getAllNhanSu();
            return View();
        }
    }
}
