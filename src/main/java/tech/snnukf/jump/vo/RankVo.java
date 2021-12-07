package tech.snnukf.jump.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.snnukf.jump.pojo.Rank;

/**
 * @author simple.jbx
 * @ClassName RankVo
 * @description //TODO
 * @email jb.xue@qq.com
 * @github https://github.com/simple-jbx
 * @date 2021/10/31/ 14:12
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankVo extends Rank {
    private int rankings;

    public RankVo(Rank rank, int rankings) {
        this.setId(rank.getId());
        this.setUserName(rank.getUserName());
        this.setUserScore(rank.getUserScore());
        this.setUpdateTime(rank.getUpdateTime());
        this.rankings = rankings;
    }
}
