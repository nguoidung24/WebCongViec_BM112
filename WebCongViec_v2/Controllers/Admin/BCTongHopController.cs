using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class BCTongHopController : Controller
    {
        protected BCTongHopService bcTongHopService;
        protected TheoDoiCPService theoDoiCPService;

        public BCTongHopController()
        {
            this.bcTongHopService = new BCTongHopService();
            this.theoDoiCPService = new TheoDoiCPService();

        }

        [Route("/BCTongHop")]
        public IActionResult BCTongHop()
        {
            string? action = HttpContext.Request.Query["action"];
            if (action != null)
            {
                if (action.Equals("updateNoiDungCongViec"))
                {
                    foreach (var queryParam in Request.Query)
                    {
                        string key = queryParam.Key;                  
                        StringValues values = queryParam.Value;       

                        foreach (var value in values)
                        {
                            if (!key.Equals("action"))
                            {
                                this.bcTongHopService.updateNoiDungCongViec(key.ToString(), value.ToString());
                            }
                        }
                    }
                }

                if (action.Equals("updateProjectInfo"))
                {
                    foreach (var queryParam in Request.Query)
                    {
                        string key = queryParam.Key;
                        StringValues values = queryParam.Value;

                        foreach (var value in values)
                        {
                            if (!key.Equals("action"))
                            {
                                this.bcTongHopService.updateProjectInfo(key.ToString(), value.ToString());
                            }
                        }
                    }
                }
            }


            ViewBag.DSNoiDungCongViec = this.bcTongHopService.DSNoiDungCongViec();
            (ViewBag.MinDate, ViewBag.MaxDate) = this.bcTongHopService.GetMinMaxNgayThiCong();
            ViewBag.ProjectInfo = this.bcTongHopService.getProjectInfo();
            ViewBag.ToDay = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.BCTongHop = "active";

            ViewBag.duToanChiPhi = this.theoDoiCPService.duToanChiPhi();

            double tongDuToan = 0;
            double _tongDaChi = 0;
            foreach (var duToan in ViewBag.duToanChiPhi)
            {
                double tong = 0;
                double tong_da_chi = 0;
                foreach (var d in duToan.Keys)
                {
                    tong = tong + double.Parse(duToan[d].DuToan.ToString());
                    tong_da_chi = tong_da_chi + double.Parse(duToan[d].DaChi.ToString());
                }
                _tongDaChi = _tongDaChi + tong_da_chi;
                tongDuToan = tongDuToan + tong;
            }
            ViewBag.TongDuToan = tongDuToan;
            ViewBag.TongDaChi = _tongDaChi;
           return View();
        }
    }
}
