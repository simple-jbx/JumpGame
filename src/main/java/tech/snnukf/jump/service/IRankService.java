package tech.snnukf.jump.service;

import com.baomidou.mybatisplus.extension.service.IService;
import tech.snnukf.jump.pojo.Rank;
import tech.snnukf.jump.vo.RankVo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author simple.jbx
 */
public interface IRankService extends IService<Rank>{
    public List<List<RankVo>> getRankList(HttpServletRequest request, HttpServletResponse response);

    public void updateInfo(HttpServletRequest request, HttpServletResponse response, Rank rank);
}
