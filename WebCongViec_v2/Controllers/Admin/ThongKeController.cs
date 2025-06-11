using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class ThongKeController : Controller
    {
        protected ThongKeService thongKeService;
        public ThongKeController()
        {
            this.thongKeService = new ThongKeService();
        }

        [Route("/ThongKe")]
        public IActionResult ThongKe(string? action,DateOnly StartDate, DateOnly EndDate)
        {
            ViewBag.ThongKeActive = "active";


            DateOnly endDate = DateOnly.FromDateTime(DateTime.Now);
            DateOnly startDate = new DateOnly(endDate.Year, endDate.Month, 1);
            if(action != null)
                if(action.Equals("display"))
                {
                    endDate = EndDate;
                    startDate = StartDate;
                }

            ViewBag.StartDate = startDate.ToString("yyyy-MM-dd");
            ViewBag.EndDate = endDate.ToString("yyyy-MM-dd");

            ViewBag.DSNoiDungCVTypeKeyValue = this.thongKeService.DSNoiDungCVTypeKeyValue();
            ViewBag.ThongKe = this.thongKeService.ThongKe(startDate, endDate);
            ViewBag.DSNoiDungCV = this.thongKeService.DSNoiDungCV();
            return View();
        }
    }
}
