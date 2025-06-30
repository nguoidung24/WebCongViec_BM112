using Microsoft.AspNetCore.Mvc;
using System.Text;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class NangSuatController : Controller
    {
        protected NangSuatService nangSuatService;
        public NangSuatController()
        {
            this.nangSuatService = new NangSuatService();
        }

        [Route("NangSuat")]
        public IActionResult NangSuat(string action, DateOnly tuNgay, DateOnly denNgay, string dataExport)
        {

            ViewBag.NangSuat = "active";
            if (action != null && action.Equals("filter"))
            { 
                ViewBag.DataNangSuat = this.nangSuatService.LayNangSuat(tuNgay, denNgay);
            }
            else
            {
                DateOnly today = DateOnly.FromDateTime(DateTime.Now);
                tuNgay = new DateOnly(today.Year, today.Month, 1); 
                denNgay = new DateOnly(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month)); 
                ViewBag.DataNangSuat = this.nangSuatService.LayNangSuat(tuNgay, denNgay);
            }
            ViewBag.TuNgay = tuNgay.ToString("yyyy-MM-dd");
            ViewBag.DenNgay = denNgay.ToString("yyyy-MM-dd");

            if (action != null && action.Equals("export"))
            {
                string htmlContent = dataExport;

                byte[] fileBytes = Encoding.UTF8.GetBytes(htmlContent);

                return File(fileBytes, "application/vnd.ms-excel", "ExportBangNangSuat.xls");
            }

            return View();
        }
    }
}
