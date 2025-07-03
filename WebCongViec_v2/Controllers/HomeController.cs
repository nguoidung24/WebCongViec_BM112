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
        [Route("/Home"), Route("/")]
        public IActionResult Index(DateOnly? selectedMonth)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Now);
            var tuNgay = new DateOnly(today.Year, today.Month, 1);
            var denNgay = new DateOnly(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month));

            ViewBag.HomeActive = "active";
            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);

            ViewBag.DaChamCongHomNay = this.homeService.DaChamCongHomNay(currentDate);
            ViewBag.TongNangSuat = this.homeService.NangSuatHomNay(currentDate);
            ViewBag.DSChamcongHomNay = this.homeService.DSChamCongHomNay(currentDate);
            ViewBag.TongNhanSu = this.homeService.TongSoNhanSu();
            ViewBag.TiLeChamCong = (this.homeService.DaChamCongHomNay(currentDate)/ 
                (double)this.homeService.TongSoNhanSu() * 100).ToString("N2");
            ViewBag.ThoiGianChamCong = this.homeService.LayNangSuat(tuNgay, denNgay);
            return View();
        }
    }
}
