package tech.snnukf.jump.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 
 * </p>
 *
 * @author simple.jbx
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class Rank implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * id cookie
     */
    private String id;

    private String userName;

    private Double userScore;

    private Date updateTime;
}
