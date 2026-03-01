package co.com.Mysticalcut.tasks;

import net.serenitybdd.core.Serenity;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;

import static co.com.Mysticalcut.userinterface.QuotesCancel.*;

public class QuotesCancel implements Task {

    public static QuotesCancel completarCampos() {
        return Instrumented.instanceOf(QuotesCancel.class).withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_QUOTES),
                Click.on(BTN_CANCEL),
                Alerts.Alert()
        );
    }
}