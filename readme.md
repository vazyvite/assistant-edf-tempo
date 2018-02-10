# assistant-edf-tempo

Ce package permet d'intéragir avec un Google Home pour le rendre capable de remonter la couleur du jour pour l'option Tempo d'EDF.

## Prérequis

assistant-edf-tempo se base sur le package assistant-plugins [assistant-plugins](https://www.npmjs.com/package/assistant-plugins) avec le plugin notifier. 
Il faut donc suivre la procédure d'installation de assistant-plugins [disponible ici](https://aymkdn.github.io/assistant-plugins) avant d'installer assistant-edf-tempo.


Cette solution est basée sur IFTTT et Pushbullet, il faudra créer un compte sur ces services et configurer assistant-plugins pour pouvoir utiliser assistant-edf-tempo.
assistant-edf-tempo se base sur assistant-plugins et appelle l'API Tempo EDF de l'[API Domogeek] (http://domogeek.entropialux.com/static/doc/index.html#api-Domogeek-GetTempo).

Les sources sont disponibles sur [Github](https://github.com/vazyvite/assistant-edf-tempo)

## Install

```bash
npm i assistant-edf-tempo@latest --save --loglevel error && npm run-script postinstall
```

## Changelog
### 1.0.15
* ajout du fichier readme.md

## License

[MIT](http://vjpr.mit-license.org)