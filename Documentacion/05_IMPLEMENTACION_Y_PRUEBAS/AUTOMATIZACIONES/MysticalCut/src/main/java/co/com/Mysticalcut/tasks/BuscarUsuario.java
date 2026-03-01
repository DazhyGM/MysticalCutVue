package co.com.Mysticalcut.tasks;

import co.com.Mysticalcut.models.CredencialesBuscarUsuario;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;


import java.util.List;

import static co.com.Mysticalcut.userinterface.AutenticacionBuscarUsuario.BTN_USUARIOS;
import static co.com.Mysticalcut.userinterface.AutenticacionBuscarUsuario.INPUT_USUARIOS;

public class BuscarUsuario implements Task {

    private List<CredencialesBuscarUsuario> credencialesBuscar;

    public BuscarUsuario(List<CredencialesBuscarUsuario> credencialesBuscar){
        this.credencialesBuscar = credencialesBuscar;
    }

    public static BuscarUsuario completarCampos(List <CredencialesBuscarUsuario> credencialesBuscar){
        return Instrumented.instanceOf(BuscarUsuario.class).withProperties(credencialesBuscar);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_USUARIOS),
                Click.on(INPUT_USUARIOS),
                Enter.theValue(credencialesBuscar.get(0).getCedula()).into(INPUT_USUARIOS)
        );

    }
}
