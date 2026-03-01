package co.com.Mysticalcut.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Scroll;


import static co.com.Mysticalcut.userinterface.Quotes.*;

public class Quotes implements Task {

    public static Quotes completarCampos() {
        return Instrumented.instanceOf(Quotes.class).withProperties();
    }


    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_SERVICES),
                Click.on(LI_CATEGORIES),
                Click.on(BTN_SERVICES_SELECT),
                Click.on(BTN_CONTINUE_SERVICES),
                Click.on(BTN_BARBER),
                Click.on(BTN_CONTINUE_BARBER),
                Click.on(BTN_MONTH),
                Click.on(BTN_DAY),
                Scroll.to(SPECIFIC_TIME_SLOT1),
                Click.on(BTN_HOUR),
                Click.on(BTN_CONFIRM_CALENDAR)
        );
    }
}
