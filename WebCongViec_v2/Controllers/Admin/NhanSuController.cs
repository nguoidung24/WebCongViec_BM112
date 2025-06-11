using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class NhanSuController : Controller
    {
        private readonly IWebHostEnvironment _env;
        protected NhanSuService nhanSuService;
        public NhanSuController(IWebHostEnvironment env)
        {
            _env = env;
            this.nhanSuService = new NhanSuService();
        }



        [Route("/NhanSu")]
        public IActionResult NhanSu()
        {
            string? setrole = HttpContext.Request.Query["setrole"].ToString();
            string? id = HttpContext.Request.Query["id"].ToString();
            if (setrole != null)
                if (setrole.Equals("1") || setrole.Equals("2") || setrole.Equals("3") || setrole.Equals("4") )
                    if(this.nhanSuService.SetRole(id, int.Parse(setrole)))
                         return RedirectToAction("NhanSu", "NhanSu", new { message = "Thành công", messageType = "success" });
                    else
                        return RedirectToAction("NhanSu", "NhanSu", new { message = "Không thành công", messageType = "warning" });
            ViewBag.NhanSuActive = "active";
            ViewBag.DSNhanSu = this.nhanSuService.DSNhanSu();
            ViewBag.Roles = new[] { "", "LEADER⭐", "SUPPORT🔰", "", "BỊ KHÓA🚫" };
            ViewBag.HideInfo = HttpContext.Request.Query["hideinfo"].ToString();
            return View();
        }

        [Route("/ThemNhanSu")]
        public IActionResult ThemNhanSu(string? action, Nhansu nhanSu)
        {
            ViewBag.ThemNhanSuActive = "active";

            if(action != null)
                if (action.Equals("create"))
                    if (this.nhanSuService.ThemNhanSu(nhanSu))
                        return RedirectToAction("ThemNhanSu", "NhanSu", new { message = "Thành công", messageType = "success" });
                    else
                        return RedirectToAction("ThemNhanSu", "NhanSu", new { message = "Không thành công", messageType = "warning" });

            return View();
        }


        [Route("/SuaNhanSu")]
        public IActionResult SuaNhanSu(string action, Nhansu nhanSu)
        {
            string? id = HttpContext.Request.Query["id"].ToString();

            ViewBag.NhanSuActive = "active";
            ViewBag.NhanSu = this.nhanSuService.LayNhanSu(int.Parse(id));

            if(action !=  null)
                if(action.Equals("edit"))
                    if(this.nhanSuService.SuaNhanSu(nhanSu))
                        return RedirectToAction("NhanSu", "NhanSu", new { message = "Đã cập nhật", messageType = "success" });
                    else
                        return RedirectToAction("NhanSu", "NhanSu", new { message = "Cập nhật không thành công", messageType = "warning" });
            return View();
        }


        [Route("/ThemDanhSachNhanSu")]
        public IActionResult ThemDanhSachNhanSu(string? action, IFormFile file)
        {
            ViewBag.ThemDanhSachNhanSuSuActive = "active";
           
            if(action != null)
                if(action.Equals("update"))
                    if(this.nhanSuService.ThemDanhSachNhanSu(file))
                       return RedirectToAction("NhanSu", "NhanSu", new { message = "Đã cập nhật", messageType = "success" });
                    else
                       return RedirectToAction("NhanSu", "NhanSu", new { message = "Cập nhật không thành công", messageType = "warning" });

            return View();
        }

        public IActionResult DownloadExcel()
        {
            string filePath = Path.Combine(_env.WebRootPath, "files", "upload_ns.xlsx");

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File không tồn tại.");
            }

            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            string fileName = "upload_ns.xlsx";

            return File(fileBytes,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }
    }
}
