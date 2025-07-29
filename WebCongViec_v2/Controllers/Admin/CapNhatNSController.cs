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
        private readonly IWebHostEnvironment _env;

        public CapNhatNSController(IWebHostEnvironment env)
        {
            this.capNhatNSService = new CapNhatNSService();
            _env = env;

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

        public IActionResult DownloadNSTempExcel()
        {
            string filePath = Path.Combine(_env.WebRootPath, WebCongViec_v2.Services.ProjectService.GetProjectName().Replace("/", ""), "files/temp_cc.xlsx");

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File không tồn tại.");
            }

            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            string fileName = "temp_cc.xlsx";

            return File(fileBytes,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }
    }
}
