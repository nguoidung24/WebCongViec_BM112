using Microsoft.AspNetCore.Mvc;
using System;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers.Admin
{
    public class NDCVController : Controller
    {
        protected NDCVService ndcvService;
        public NDCVController()
        {
            this.ndcvService = new NDCVService();
        }

        [Route("/NDCV")]
        public IActionResult NDCV()
        {
            string? delete = HttpContext.Request.Query["delete"].ToString();
            try
            {
                if(!delete.Equals(""))
                {
                    int id = int.Parse(delete);
                    if (id > 0) { 
                        if(this.ndcvService.DeleteNDCV(id))
                            return RedirectToAction("NDCV", "NDCV", new { message = "Xóa thành công!", messageType = "success" });
                        return RedirectToAction("NDCV", "NDCV", new { message = "Nội dung CV có thể đang được sử dụng - không thể xóa", messageType = "warning" });
                    }
                    else
                    {
                        return RedirectToAction("NDCV", "NDCV", new { message = "Không thể xóa nội dung này", messageType = "warning" });
                    }
                }
            }
            catch (Exception e)
            {
                return RedirectToAction("NDCV", "NDCV", new { message = "Nội dung CV có thể đang được sử dụng - không thể xóa", messageType = "warning" });
            }
            ViewBag.NDCVActive = "active";
            ViewBag.DSNDCV = this.ndcvService.DSNDVC(); 
            return View();
        }

        [Route("/SuaNDCV")]
        public IActionResult SuaNDCV(string action, Noidungcongviec noiDungCongViec)
        {
            string? id = HttpContext.Request.Query["id"].ToString();

            ViewBag.NDCVActive = "active";
            ViewBag.NDCV = this.ndcvService.LayNDCV(int.Parse(id));

            if (action != null)
                if (action.Equals("edit"))
                    if (this.ndcvService.SuaNDCV(noiDungCongViec))
                        return RedirectToAction("NDCV", "NDCV", new { message = "Đã cập nhật", messageType = "success" });
                    else
                        return RedirectToAction("NDCV", "NDCV", new { message = "Cập nhật không thành công", messageType = "warning" });
            return View();
        }

        [Route("/ThemNDCV")]
        public IActionResult ThemNDCV(string action, Noidungcongviec noiDungCongViec)
        {
            ViewBag.ThemNDCVActive = "active";
            
            if (action != null)
                if (action.Equals("create"))
                {

                    if(this.ndcvService.ThemNDCV(noiDungCongViec))
                        return RedirectToAction("NDCV", "NDCV", new { message = "Thành Công!", messageType = "success" });
                    return RedirectToAction("NDCV", "NDCV", new { message = "Không thành công!", messageType = "warning" });
                }

            return View();
        }
    }
}
