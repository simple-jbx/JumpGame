package tech.snnukf.jump.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import tech.snnukf.jump.service.IRankService;
import tech.snnukf.jump.pojo.Rank;
import tech.snnukf.jump.vo.RankVo;
import tech.snnukf.jump.vo.RespBean;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author simple.jbx
 */
@Controller
@RequestMapping("/rank")
public class RankController {
    @Autowired
    IRankService rankService;

    /**
     * @author simple.jbx
     * @description 未使用redis 3 使用Redis优化前 25 优化后 35 继续优化 50
     * 不使用数据库 纯Redis 200
     * 优化思路  减少数据库IO 将不必要的数据库IO放到Redis上
     * @date 10:53 2021/11/1
     * @param	request
     * @param	response
     * @return tech.snnukf.jump.vo.RespBean
     **/
    @RequestMapping("/get")
    @ResponseBody
    public RespBean getRank(HttpServletRequest request, HttpServletResponse response) {
        List<List<RankVo>> resList = rankService.getRankList(request, response);
        return RespBean.success(resList);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public RespBean updateRank(HttpServletRequest request, HttpServletResponse response,
        String username, double score) {
        Rank rank = new Rank("", username, score, new Date());
        rankService.updateInfo(request, response, rank);
        List<List<RankVo>> resList = rankService.getRankList(request, response);
        return RespBean.success(resList);
    }
}
