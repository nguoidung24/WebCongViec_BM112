using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class TheoDoiCPController : Controller
    {
        protected TheoDoiCPService theoDoiCPService;
        public TheoDoiCPController()
        {
            this.theoDoiCPService = new TheoDoiCPService();
        }

        [Route("/TheoDoiCP")]
        public IActionResult TheoDoiCP(string? anHangTrong, IFormCollection? form)
        {
            ViewBag.TheoDoiCP = "active";
            ViewBag.khauHaoMayScan = this.theoDoiCPService.khauHaoMayScan();
            ViewBag.duToanChiPhi = this.theoDoiCPService.duToanChiPhi();
            ViewBag.AnHangTrong = anHangTrong == null ? "0": anHangTrong;

            if (form != null)
            {
                if (form.ContainsKey("action"))
                {
                    if (form["action"].ToString().Equals("updateDuToan"))
                    {
                        foreach (var key in form.Keys)
                        {
                            if (!key.Equals("action"))
                            {
                                string value = form[key];
                                this.theoDoiCPService.updateDuToanChiPhi(key, value);
                            }
                        }
                    }
                }
            }


            return View();
        }
    }
}
