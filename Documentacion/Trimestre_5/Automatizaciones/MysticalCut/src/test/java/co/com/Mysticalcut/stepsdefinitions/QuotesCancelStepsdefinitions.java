package co.com.Mysticalcut.stepsdefinitions;


import co.com.Mysticalcut.questions.ValidacioneQuotes;
import co.com.Mysticalcut.questions.ValidacionesQuotesCancel;
import co.com.Mysticalcut.tasks.QuotesCancel;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class QuotesCancelStepsdefinitions {

    @Cuando("^Cancelar la cita que se quiere cancelar$")
    public void cancelarLaCitaQueSeQuiereCancelar() {
        theActorInTheSpotlight().attemptsTo(QuotesCancel.completarCampos()
        );
    }


    @Entonces("^Verificar que se cancele la cita$")
    public void verificarQueSeCanceleLaCita() {
        theActorInTheSpotlight().should(seeThat(ValidacionesQuotesCancel.validar()));
    }
}
