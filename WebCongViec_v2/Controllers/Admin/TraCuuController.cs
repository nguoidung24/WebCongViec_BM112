using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class TraCuuController : Controller
    {

        protected TraCuuService traCuuService;
        public TraCuuController()
        {
            this.traCuuService = new TraCuuService();
        }

        [Route("/TraCuu")]
        public IActionResult TraCuu(string action, DateOnly startDate, DateOnly endDate, int jobId, string typeId)
        {
            ViewBag.StartDate = startDate != default(DateOnly) ? startDate.ToString("yyyy-MM-dd") : "2003-10-12";
            ViewBag.EndDate = endDate != default(DateOnly) ? endDate.ToString("yyyy-MM-dd") : DateOnly.FromDateTime(DateTime.Now).ToString("yyyy-MM-dd") ;
            ViewBag.JobId = jobId;
            ViewBag.TypeId = typeId != null ? typeId : "";
            ViewBag.DSNoiDungCongViec = this.traCuuService.layNoiDungCongViec();
            ViewBag.TraCuu = "active";
            if (action != null && action.Equals("TraCuu"))
            {
                ViewBag.DataTraCuu = this.traCuuService.getData(startDate, endDate, jobId, typeId); 
            }
            return View();
        }
    }
}
