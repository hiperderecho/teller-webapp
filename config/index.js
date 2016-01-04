module.exports =
{ webapp: { apiUrl          : process.env.TELLER_WEBAPP_APIURL || 'http://localhost:5000/'
          , views           : { index: { questionsLimit: 10 } }
          , cookieNameSpace : 'Pidela.info-authorSecret'
          , localizedStatus : { successful  : 'Válida'
                              , unsuccessful: 'Insatisfactoria'
                              , unanswered  : 'Desatendida'
                              , open        : 'Abierta' }
          , flaggedStatus   : 'flagged'
          , messages : { questionView : { authorSecretMismatch : '<h4>Hubo un error</h4><p>El código no coincide.</p>'
                                        , questionWasUpdated   : '<h4>La pregunta fue actualizada</h4>'
                                        , authorSecretSent     : '<p>El código de esta pregunta fue enviado al correo del Autor</p>'
                                        }
                       , thereWasAnError    : '<p>Hubo un error : '
                       , thereWasAnErrorPre : '<h4>Hubo un error</h4><pre>'
                       }
          }
};