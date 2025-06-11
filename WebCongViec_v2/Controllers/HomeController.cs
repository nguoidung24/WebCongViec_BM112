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


            ViewBag.SelectedMonth = "";
            var DSNhanSu = this.homeService.DSNhanSu();
            var DSCongViec = this.homeService.DSCongViec();
            var _DLChamCong = this.homeService.DLChamCong(DSNhanSu);
            var DLChamCong = new Dictionary<string, Dictionary<int, List<Chamcong>>>();
            if (selectedMonth != null)
            {
                ViewBag.HomeActive = "active";
                ViewBag.SelectedMonth = selectedMonth.Value.Year.ToString() + "-" + selectedMonth.Value.Month.ToString("D2");
                foreach (var item in _DLChamCong.Keys)
                {

                    if (item.Split("/")[1].Equals(selectedMonth.Value.Month.ToString("D2")) && item.Split("/")[2].Equals(selectedMonth.Value.Year.ToString()))
                        DLChamCong.Add(item, _DLChamCong[item]);
                }
            }
            else
            {
                DLChamCong = _DLChamCong;
            }
            

            ViewBag.DSNhanSu = DSNhanSu;
            ViewBag.DLChamCong = DLChamCong;
            ViewBag.DSCongViec = DSCongViec;
            return View();
        }
    }
}
