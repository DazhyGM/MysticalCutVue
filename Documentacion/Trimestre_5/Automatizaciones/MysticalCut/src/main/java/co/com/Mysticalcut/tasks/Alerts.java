package co.com.Mysticalcut.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;

public class Alerts implements Task {


    public static Alerts Alert(){return Tasks.instrumented(Alerts.class);
    }
    @Override
    public <T extends Actor> void performAs(T actor) {
        WebDriver driver = net.serenitybdd.core.Serenity.getWebdriverManager().getCurrentDriver();
        Alert alert = driver.switchTo().alert();
        alert.accept();}
}