package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class EliminarProducto extends PageObject {

    public static Target BTN_PRODUCTS = Target.the("Ir al modulo de productos ").located(By.xpath("//*[@id=\"app\"]/div/div[1]/header/ul/li[4]/a"));

    public static Target BTN_PRODUCTS_ELIMINAR = Target.the("Descripcion del servicio").located(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div[4]/div/button[3]"));

    public static Target BTN_INACTIVE_PRODUCTS = Target.the("NOMBRE DEL SERVICIO").located(By.xpath("//*[@id=\"app\"]/div/div/div[1]/a[2]"));
    public static Target MENSAJE_VIEW_PRODUCTS_ELIMINAR = Target.the("NOMBRE DEL SERVICIO").located(By.xpath("//*[@id=\"app\"]/div/div/div[1]/a[2]"));

}