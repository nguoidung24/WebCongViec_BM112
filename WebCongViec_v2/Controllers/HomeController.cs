using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebCongViec_v2.Models;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.EntityFrameworkCore;
using WebCongViec_v2.Services;
namespace WebCongViec_v2.Controllers
{
    public class HomeController : Controller 
    {
        protected HomeService homeService;
        public HomeController()
        {
            this.homeService = new HomeService();
        }

        public IActionResult Index(DateOnly? selectedMonth)
        {
            ViewBag.HomeActive = "active";
            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);

            ViewBag.DaChamCongHomNay = this.homeService.DaChamCongHomNay(currentDate);
            ViewBag.TongNangSuat = this.homeService.NangSuatHomNay(currentDate);
            ViewBag.DSChamcongHomNay = this.homeService.DSChamCongHomNay(currentDate);
            ViewBag.TongNhanSu = this.homeService.TongSoNhanSu();
            ViewBag.TiLeChamCong = (this.homeService.DaChamCongHomNay(currentDate)/ 
                (double)this.homeService.TongSoNhanSu() * 100).ToString("N2");
            return View();
        }
    }
}
