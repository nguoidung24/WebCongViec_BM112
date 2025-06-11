using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class NDCVService:  BaseService
    {
        public List<Noidungcongviec> DSNDVC()
        {
            return this.DbContext.Noidungcongviecs.Where(row => row.IdNoiDungCongViec != 0).ToList();    
        }


        public Noidungcongviec LayNDCV(int id)
        {
            return this.DbContext.Noidungcongviecs.Where(row => row.IdNoiDungCongViec == id).First();
        }
        public bool SuaNDCV(Noidungcongviec noiDungCongViec)
        {
            var hasNoiDungCongViec = this.DbContext.Noidungcongviecs.FirstOrDefault(row => row.IdNoiDungCongViec == noiDungCongViec.IdNoiDungCongViec);
            if (hasNoiDungCongViec == null)
                return false;
            hasNoiDungCongViec.ValueNoiDungCongViec = noiDungCongViec.ValueNoiDungCongViec;
            hasNoiDungCongViec.DonVi = noiDungCongViec.DonVi;
            hasNoiDungCongViec.DinhMuc8h = noiDungCongViec.DinhMuc8h;
            this.DbContext.Noidungcongviecs.Update(hasNoiDungCongViec);
            this.DbContext.SaveChanges();
            return true;
        }

        public bool DeleteNDCV(int id)
        {
            var NDCV =this.DbContext.Noidungcongviecs.Where(row => row.IdNoiDungCongViec == id).FirstOrDefault();
            if (NDCV == null)
                return false;
            try
            {
                this.DbContext.Remove(NDCV);
                this.DbContext.SaveChanges();
            }catch(Exception e)
            {
                return false;
            }
            return true;
        }

        public bool ThemNDCV(Noidungcongviec noiDungCongViec)
        {
            try
            {
                if (noiDungCongViec.DonVi == null)
                {
                    noiDungCongViec.DonVi = "";
                }
                this.DbContext.Noidungcongviecs.Add(noiDungCongViec);
                this.DbContext.SaveChanges();
            }
            catch(Exception e )
            {
                return false;
            }
            return true;
        }
    }
}
