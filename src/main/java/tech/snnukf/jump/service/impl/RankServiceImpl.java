package tech.snnukf.jump.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import tech.snnukf.jump.mapper.RankMapper;
import tech.snnukf.jump.pojo.Rank;
import tech.snnukf.jump.service.IRankService;
import tech.snnukf.jump.utils.CookieUtil;
import tech.snnukf.jump.utils.UUIDUtil;
import tech.snnukf.jump.vo.RankVo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author simple.jbx
 */
@Service
public class RankServiceImpl extends ServiceImpl<RankMapper, Rank> implements IRankService {
    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    public List<List<RankVo>> getRankList(HttpServletRequest request, HttpServletResponse response) {
        List<List<RankVo>> resList = (List<List<RankVo>>) redisTemplate.opsForValue().get("ranking-list");
        return resList;
    }

    @Override
    public void updateInfo(HttpServletRequest request, HttpServletResponse response, Rank rank) {
        String cookie = CookieUtil.getCookieValue(request, "userTicket");
        if(StringUtils.isEmpty(cookie)) {
            cookie = UUIDUtil.uuid();
            CookieUtil.setCookie(request, response, "userTicket", cookie);
        }

        rank.setId(cookie);
        updateRankList("ranking-set", "ranking-hash", rank);
    }

    private void updateRankList(String rankingSet, String hashKey, Rank selfRank) {
        Map<String, Rank> rankMap = redisTemplate.opsForHash().entries(hashKey);

        if(redisTemplate.opsForHash().hasKey(hashKey, selfRank.getId())) {
            Rank oldRank = (Rank)redisTemplate.opsForHash().get(hashKey, selfRank.getId());
            if(oldRank.getUserScore().doubleValue() >= selfRank.getUserScore().doubleValue()
            && oldRank.getUserName().equals(selfRank.getUserName())) {
                //无需更新
                return;
            } else {
                //需要更新
                redisTemplate.opsForZSet().remove("ranking-set", selfRank.getId());
            }
        } else {
            //首次插入
            redisTemplate.opsForHash().put("ranking-hash", selfRank.getId(), selfRank);
        }

        redisTemplate.opsForZSet().add("ranking-set", selfRank.getId(), selfRank.getUserScore());
        Set<String> range = redisTemplate.opsForZSet().reverseRange(rankingSet, 0, 100);
        List<RankVo> rankList = new ArrayList<>(100);
        List<RankVo> rankSelf = new ArrayList<>(1);
        List<List<RankVo>> resList = new ArrayList<>(2);

        int ranking = 1;
        for (String str : range) {
            rankList.add(new RankVo((Rank) redisTemplate.opsForHash().get(hashKey, str), ranking++));
        }

        Long selfRanking = redisTemplate.opsForZSet().reverseRank(rankingSet, selfRank.getId());
        rankSelf.add(new RankVo(selfRank, selfRanking.intValue() + 1));

        resList.add(rankList);
        resList.add(rankSelf);
        redisTemplate.opsForValue().set("ranking-list", resList);
    }
}
