using Microsoft.AspNetCore.Mvc;
using System.Text;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class BangLuongController : Controller
    {
        protected BangLuongService bangLuongService;
        public BangLuongController()
        {
            this.bangLuongService = new BangLuongService();
        }

        List<string> getStartEndDate()
        {
            DateTime now = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(now.Year, now.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            // Format dates to "YYYY/MM/DD"
            string formattedFirstDay = firstDayOfMonth.ToString("yyyy-MM-dd");
            string formattedLastDay = lastDayOfMonth.ToString("yyyy-MM-dd");

            return new List<string> { formattedFirstDay, formattedLastDay };
        }

        [Route("/BangLuong")]
        public IActionResult BangLuong(string action, string table)
        {
            ViewBag.BangLuong = "active";
            ViewBag.StartDate = getStartEndDate()[0];
            ViewBag.EndDate = getStartEndDate()[1];

            string startDate = Request.Query["startDate"];
            string endDate = Request.Query["endDate"];

            if (!string.IsNullOrEmpty(startDate))
            {
                ViewBag.StartDate = startDate; 
            }

            if (!string.IsNullOrEmpty(endDate))
            {
                ViewBag.EndDate = endDate;
            }

            ViewBag.DSTongNgayCong = this.bangLuongService.layTongSoNgayCong(DateOnly.Parse(ViewBag.StartDate), DateOnly.Parse(ViewBag.EndDate));
            ViewBag.DSNhanSuChamCong = this.bangLuongService.tinhLuong(DateOnly.Parse(ViewBag.StartDate), DateOnly.Parse(ViewBag.EndDate));
            ViewBag.TongLuong = this.bangLuongService.TONGLUONG.ToString("N2");


            if (action != null && action.Equals("export"))
            {
                string htmlContent = table;

                byte[] fileBytes = Encoding.UTF8.GetBytes(htmlContent);

                return File(fileBytes, "application/vnd.ms-excel", "ExportBangLuong.xls");
            }

            return View();
        }
    }
}
