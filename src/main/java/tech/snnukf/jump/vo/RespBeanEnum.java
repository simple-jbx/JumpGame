package tech.snnukf.jump.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * @author simple.jbx
 * @email jb.xue@qq.com
 * @github https://github.com/simple-jbx
 * @ClassName RespBeanEnum
 * @description:
 * @date 2021年10月01日 15:22
 */
@ToString
@Getter
@AllArgsConstructor
public enum RespBeanEnum {
    //通用
    SUCCESS(200, "SUCCESS"),
    ERROR(500, "服务端异常"),

    //更新异常
    UPDATE_FAIL(500300, "更新失败"),
    ;

    private final Integer code;
    private final String message;
}
