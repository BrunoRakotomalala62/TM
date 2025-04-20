
const express = require('express');
const router = express.Router();

// Données des horoscopes (simulation d'une base de données)
const horoscopes = {
  belier: {
    fr: {
      amour: "Votre vie amoureuse s'illuminera aujourd'hui. Si vous êtes en couple, profitez de moments complices avec votre partenaire. Pour les célibataires, une rencontre inattendue pourrait bien changer votre quotidien.",
      argent: "Vos finances sont stables, mais restez vigilant sur vos dépenses. Un investissement à long terme pourrait s'avérer particulièrement bénéfique si vous l'étudiez avec soin.",
      sante: "Votre énergie est au beau fixe. Profitez-en pour vous adonner à une activité physique qui vous plaît particulièrement. N'oubliez pas de vous hydrater régulièrement.",
      travail: "Dynamique et créatif, vous impressionnerez vos collègues par votre capacité à résoudre les problèmes. Une opportunité professionnelle pourrait se présenter prochainement.",
      famille: "L'harmonie règne dans votre foyer. C'est le moment idéal pour organiser une réunion familiale ou simplement passer du temps de qualité avec vos proches."
    },
    mg: {
      amour: "Hirehitra ny fiainam-pitiavana anao androany. Raha manana namana ianao, manaova fotoana tsara miaraka aminy. Ho an'ireo mbola mitady, mety hisy fihaonana tsy ampoizina mety hanova ny fiainanao.",
      argent: "Milamina ny ara-bola, fa mila mitandrina ny fandaniana. Mety ho tsara ny fandraisana anjara maharitra raha dinihina tsara izany.",
      sante: "Mirehitra ny herinao. Mandraisa anjara amin'ny fanatanjahantena izay tena tianao. Aza adino ny misotro rano matetika.",
      travail: "Mavitrika sy mamorona, hampahatalanjona ny mpiara-miasa aminao amin'ny fahaizanao mamaha olana. Mety hisy fahafahana amin'ny asa ho avy amin'ny ho avy.",
      famille: "Misy firindrana ao an-tokantrano. Izao no fotoana tsara handaminana fihaonana ara-pianakaviana na handany fotoana tsara miaraka amin'ny havana."
    }
  },
  taureau: {
    fr: {
      amour: "L'amour vous apporte stabilité et réconfort aujourd'hui. Les couples ressentiront un approfondissement de leur lien. Célibataires, votre charme naturel attirera l'attention d'une personne intéressante.",
      argent: "Vos finances se portent bien. Une rentrée d'argent inattendue pourrait survenir dans les jours à venir. C'est un bon moment pour revoir votre budget.",
      sante: "Prenez soin de votre corps en vous accordant suffisamment de repos. Une alimentation équilibrée vous aidera à maintenir votre vitalité actuelle.",
      travail: "Votre persévérance porte ses fruits. Un projet sur lequel vous travaillez depuis longtemps pourrait enfin aboutir, vous apportant reconnaissance et satisfaction.",
      famille: "Les relations familiales sont au beau fixe. Prenez l'initiative d'organiser un moment convivial qui renforcera les liens entre les générations."
    },
    mg: {
      amour: "Mitondra fahatoniavana sy fampiononana ho anao ny fitiavana anio. Hahatsapa ny mpiara-dia fa mihamatotra ny fifandraisana. Ho anao izay mbola mitady, ny hasosoranao voajanahary dia hitarika ny saim-panao mahaliana.",
      argent: "Tsara ny toe-bolao. Mety hisy vola tsy nampoizina ho avy amin'ny andro ho avy. Fotoana tsara ity hanavaozana ny tetibola.",
      sante: "Tandremo ny vatanao amin'ny alàlan'ny fialan-tsasatra ampy. Hanampy anao hitazona ny fahavitrihana ankehitriny ny sakafo voalamina.",
      travail: "Mitondra vokany ny fikirizana anao. Mety hivoaka ihany ny tetikasa iray nianareo nandritra ny fotoana maharitra, mitondra fankatoavana sy fahafaham-po.",
      famille: "Tsara ny fifandraisana ara-pianakaviana. Raiso an-tanana ny fandaminana fotoana mahafinaritra izay hanamafy ny fifandraisana eo amin'ny taranaka."
    }
  },
  gemeaux: {
    fr: {
      amour: "Journée placée sous le signe de la communication en amour. Exprimez vos sentiments avec sincérité. Les célibataires pourraient faire une rencontre stimulante intellectuellement.",
      argent: "Prudence dans vos dépenses aujourd'hui. Évitez les achats impulsifs et privilégiez les investissements réfléchis pour assurer votre sécurité financière.",
      sante: "Votre système nerveux est particulièrement sensible. Accordez-vous des moments de détente pour évacuer le stress accumulé et pratiquez des exercices de respiration.",
      travail: "Votre créativité est à son apogée. Profitez-en pour proposer de nouvelles idées qui pourraient bien séduire vos supérieurs et faire avancer votre carrière.",
      famille: "Quelques tensions pourraient surgir dans le cercle familial. Gardez votre calme et privilégiez le dialogue pour résoudre les malentendus."
    },
    mg: {
      amour: "Andro ahitana fifandraisana amin'ny fitiavana. Ambarao amim-pahatsorana ny fahatsapanao. Ho an'ireo mbola mitady, mety hahita olona mampirisika ara-tsaina.",
      argent: "Mitandrema amin'ny fandanianao anio. Ialao ny fividianana an-katerena ary safidio ny fampiasam-bola voalanjalanja mba hahazoana antoka ny filaminana ara-bola.",
      sante: "Marefo ny rafitra nervoa anao. Mampiasa fotoana fialan-tsasatra mba hanafoanana ny fanerena miangona ary manaova fampiasana fisefoana.",
      travail: "Tonga amin'ny fara-tampony ny famoronanao. Profite-en pour proposer de nouvelles idées qui pourraient bien séduire vos supérieurs et faire avancer votre carrière.",
      famille: "Mety hisy olana kely eo amin'ny fianakaviana. Hazony ny fahatoniana ary ataovy lohalaharana ny resaka hamahana ny tsy fifankazahoana."
    }
  },
  cancer: {
    fr: {
      amour: "Votre sensibilité est votre plus grande force en amour aujourd'hui. Les couples vivront des moments d'une grande tendresse. Célibataires, ne vous refermez pas sur vous-même, l'amour peut surgir là où vous ne l'attendez pas.",
      argent: "Situation financière stable. Un projet d'épargne pourrait commencer à porter ses fruits. Continuez sur cette voie de sagesse budgétaire.",
      sante: "Écoutez les signaux que vous envoie votre corps. Un peu de fatigue pourrait se faire sentir, n'hésitez pas à ralentir le rythme et à vous accorder des pauses.",
      travail: "Votre intuition vous sera précieuse dans votre environnement professionnel. Faites-vous confiance pour prendre les bonnes décisions concernant un projet important.",
      famille: "Le foyer est votre havre de paix. Vous vous sentez particulièrement à l'aise dans votre rôle familial aujourd'hui, ce qui renforce l'harmonie générale."
    },
    mg: {
      amour: "Ny fahatsapanao no tanjaka lehibe indrindra amin'ny fitiavana anio. Hiaina fotoana be fitiavana ny mpifankatia. Aza mihidy ao anatinao, ry mpitady, mety hiseho eo amin'izay tsy andrasanao ny fitiavana.",
      argent: "Maharitra ny toe-bola. Mety hanomboka hamokatra ny tetikasa tahiry iray. Tohizo amin'io lalana fahendrena ara-tetibola io.",
      sante: "Henoy ny famantarana alefan'ny vatanao. Mety misy harerahana kely, aza misalasala ny mampihena ny hafainganam-pandeha sy manome anao fakan-aina.",
      travail: "Sarobidy ho anao ny saina feno ao amin'ny tontolo ara-pamokarana. Aza misalasala ny mandray fanapahan-kevitra mifanaraka amin'ny tetikasa lehibe.",
      famille: "Ny tokantranonao no toerana fialofana. Tena mahazo aina amin'ny anjara asanao amin'ny fianakaviana ianao anio, izay manamafy ny firindrana ankapobeny."
    }
  },
  lion: {
    fr: {
      amour: "Votre charisme naturel vous place sous les projecteurs aujourd'hui. En couple, votre partenaire sera fier de vous et ne manquera pas de vous le montrer. Célibataires, votre magnétisme pourrait bien attirer l'attention d'une personne qui vous admire en secret.",
      argent: "Journée favorable pour lancer un nouveau projet financier. Votre intuition concernant les investissements sera particulièrement aiguisée, faites-lui confiance.",
      sante: "Débordant d'énergie, vous êtes en pleine forme physique. Canalisez cette vitalité dans une activité sportive qui vous permet de vous dépasser.",
      travail: "Votre leadership est reconnu et apprécié. Une opportunité de prendre davantage de responsabilités pourrait se présenter, n'hésitez pas à la saisir.",
      famille: "Vous êtes le pilier de votre famille aujourd'hui. Votre force et votre générosité apportent stabilité et joie à vos proches."
    },
    mg: {
      amour: "Ny karisma voajanahary anao no mametraka anao eo ambany jiro anio. Eo amin'ny mpivady, ho faly aminao ny namanao ary tsy hanadino ny hampiseho anao izany. Ianao mpitady, ny fihazinan-javatra anao dia mety hitarika ny saim-panao manaja anao mangingina.",
      argent: "Andro tsara hanombohana tetikasa ara-bola vaovao. Ny fahitanao momba ny fampiasam-bola dia ho maranitra manokana, matoky azy.",
      sante: "Feno hery ianao, ary ara-batana ianao. Lazao ity hery ity amin'ny fanatanjahantena izay ahafahan'ny tenanao mihoatra anao.",
      travail: "Ny fitarihan-dranao dia ekena sy ankasitrahana. Mety ho avy ny fahafahana haka andraikitra bebe kokoa, aza misalasala ny handray izany.",
      famille: "Ianao no andry amin'ny fianakavianao anio. Ny tanjaka sy ny fahalalahan-tananao dia mitondra fahatokisana sy fifaliana amin'ny havana."
    }
  },
  vierge: {
    fr: {
      amour: "Votre rigueur habituelle fait place à plus de spontanéité dans vos relations amoureuses. Cette nouvelle attitude plaira beaucoup à votre partenaire. Célibataires, votre authenticité attirera une personne partageant vos valeurs.",
      argent: "Excellente journée pour faire le point sur vos finances et optimiser votre gestion. Votre sens du détail vous permettra de détecter des économies potentielles.",
      sante: "Accordez une attention particulière à votre alimentation aujourd'hui. De petits changements dans vos habitudes pourraient avoir un impact positif sur votre bien-être général.",
      travail: "Votre méthode et votre organisation font merveille. Un problème complexe trouvera sa solution grâce à votre approche analytique et rigoureuse.",
      famille: "Vous avez besoin d'ordre dans votre environnement familial. Prenez le temps de réorganiser votre espace de vie pour plus d'harmonie et de fonctionnalité."
    },
    mg: {
      amour: "Ny henjanao mahazatra dia manome toerana ho an'ny fahalalan-kirorohana amin'ny fifandraisana fitiavana. Ho tia izany toetra vaovao izany ny namanao. Mpitady, ny tena maha-ianao anao dia hitarika olona mizara ny soatoavinao.",
      argent: "Andro tsara hanombanana ny toe-bolanao sy hanatsarana ny fitantananao. Ny fahatsapanao antsipiriana dia hahafahanao mahita tahiry mety hisy.",
      sante: "Omeo fitandremana manokana ny sakafonao anio. Mety hisy fiantraikany tsara amin'ny fahasalamanao ankapobeny ny fanovana kely amin'ny fahazaranao.",
      travail: "Mahafinaritra ny fomba fiasanao sy ny fikarakaranao. Hahita ny vahaolana amin'ny olana sarotra noho ny fomba fandinikao sy fitsipika.",
      famille: "Mila lamina amin'ny tontolo misy ny fianakavianao ianao. Makà fotoana handaminana indray ny toeram-piainanao mba hahazoana firindrana sy asa be kokoa."
    }
  },
  balance: {
    fr: {
      amour: "L'harmonie règne dans votre vie sentimentale. Les couples profiteront d'un bel équilibre relationnel. Célibataires, votre diplomatie naturelle pourrait bien séduire une personne de votre entourage.",
      argent: "Vos finances sont équilibrées, mais une dépense imprévue pourrait survenir. Gardez une marge de sécurité dans votre budget pour faire face à cette éventualité.",
      sante: "Trouvez l'équilibre entre activité et repos. Votre bien-être dépend aujourd'hui de votre capacité à alterner efficacement entre les périodes d'action et de récupération.",
      travail: "Votre sens de la justice et votre aptitude à la médiation seront très appréciés dans votre environnement professionnel. Vous pourriez être sollicité pour résoudre un conflit.",
      famille: "Vous êtes le médiateur naturel de votre famille. Votre intervention permettra d'apaiser une tension entre deux proches qui n'arrivent pas à communiquer efficacement."
    },
    mg: {
      amour: "Misy firindrana eo amin'ny fiainam-pitiavana. Hankafy ny fifandanjana tsara amin'ny fifandraisana ny mpifankatia. Mpitady, ny diplomasia voajanahary anao dia mety hitaona olona iray manodidina anao.",
      argent: "Voalanjalanja ny volao, saingy mety hisy fandaniana tsy ampoizina. Tehirizo ny margin'ny fiarovana amin'ny tetibola mba hiomanana amin'io mety ho io.",
      sante: "Mahita fifandanjana eo amin'ny asa sy ny fialan-tsasatra. Ny fahasalamanao dia miankina anio amin'ny fahaizanao manome hevi-baovao amin'ny vanim-potoanan'ny hetsika sy ny fialan-tsasatra.",
      travail: "Ho tena ankasitrahana amin'ny tontolo misy anao ara-pamokarana ny fahatsapanao ny fahamarinana sy ny fahaizana mampihavana. Mety hangataka anao hamaha fifandirana ianao.",
      famille: "Ianao no mpanelanelana voajanahary amin'ny fianakavianao. Ny fandraisan'anjara anao dia hampitoniana olana eo amin'ny olona roa akaiky izay tsy afaka mifandray amin'ny fomba mahomby."
    }
  },
  scorpion: {
    fr: {
      amour: "La passion est au rendez-vous aujourd'hui. Les relations amoureuses seront intenses et profondes. Célibataires, une rencontre pourrait vous bouleverser et réveiller des sentiments que vous pensiez enfouis.",
      argent: "Soyez vigilant concernant vos comptes. Une transaction importante pourrait nécessiter toute votre attention. Prenez le temps d'examiner les détails avant de vous engager.",
      sante: "Votre énergie est puissante mais a besoin d'être canalisée. Des exercices d'intensité modérée à forte vous aideront à maintenir un équilibre physique et émotionnel.",
      travail: "Votre détermination impressionne vos collègues. Un projet difficile pourrait vous être confié en raison de votre capacité à aller au fond des choses.",
      famille: "Les relations familiales sont marquées par une intensité émotionnelle. Exprimez vos sentiments avec sincérité, mais évitez les accusations qui pourraient blesser."
    },
    mg: {
      amour: "Eo ny fitiavana anio. Ho mafonja sy lalina ny fifandraisan'ny fitiavana. Mpitady, mety hisy fihaonana iray hanafintohina anao sy hamohazana fahatsapana izay noheverinao fa nilevina.",
      argent: "Mitandreha momba ny kaontinao. Mety mila ny fifantohan'ny sainao rehetra ny fifanakalozana lehibe iray. Makà fotoana handinihana ny antsipirihany alohan'ny hirketana.",
      sante: "Mahery ny herinao saingy mila atao. Hanampy anao hitazona fifandanjan'ny vatana sy fihetseham-po ny fampiasana fatratra antonony hatramin'ny avo.",
      travail: "Ny fanampahan-kevitrao dia mahatalanjona ny mpiara-miasa aminao. Mety hisy tetikasa sarotra omena anao noho ny fahaizanao mandeha any amin'ny fotony.",
      famille: "Ny fifandraisana ara-pianakaviana dia voamariky ny hamafin'ny fihetseham-po. Ambarao amim-pahatsorana ny fahatsapanao, fa ialao ny fiampangana mety handratra."
    }
  },
  sagittaire: {
    fr: {
      amour: "Votre optimisme naturel rend votre relation amoureuse plus légère et joyeuse. Partagez vos rêves et vos aspirations avec votre partenaire. Célibataires, une personne enthousiaste et aventureuse pourrait bien croiser votre chemin.",
      argent: "Journée favorable aux investissements à long terme. Votre vision optimiste de l'avenir vous aide à prendre des décisions financières judicieuses.",
      sante: "Pleine forme aujourd'hui! Votre besoin de liberté et d'espace vous pousse à l'extérieur. Une randonnée ou une activité en plein air vous fera le plus grand bien.",
      travail: "Votre enthousiasme est communicatif et motive toute votre équipe. Un projet ambitieux pourrait voir le jour grâce à votre capacité à voir grand et loin.",
      famille: "Vous avez envie de faire partager de nouvelles expériences à votre famille. Proposez une sortie originale qui sortira tout le monde de sa routine."
    },
    mg: {
      amour: "Ny optimism anao voajanahary dia manamora ny fifandraisana ara-pitiavana anao sy mahafinaritra kokoa. Zarao ny nofinofinao sy ny fanirian'ny fonao amin'ny namanao. Mpitady, mety hifanena amin'ny lalanao ny olona iray feno fientanam-po sy sahy.",
      argent: "Andro tsara amin'ny fampiasam-bola maharitra. Ny fomba fijery optimisma ny ho avy dia manampy anao handray fanapahan-kevitra ara-bola hendry.",
      sante: "Tsara endrika anio! Ny filàna fahafahana sy habaka dia manosika anao any ivelany. Hanao soa be aminao ny fandehanana an-tongotra na asa ivelany.",
      travail: "Mifampita ny entanin'ny fo anao ary mampavitrika ny ekipanao manontolo. Mety hisy tetikasa ambony dia noho ny fahaizanao mahita zavatra lehibe sy lavitra.",
      famille: "Te-hizara traikefa vaovao amin'ny fianakavianao ianao. Manomeza fivoahana tsy mahazatra izay hamoaka ny rehetra amin'ny fahazarana."
    }
  },
  capricorne: {
    fr: {
      amour: "La stabilité émotionnelle caractérise votre vie amoureuse aujourd'hui. Les fondations solides de votre relation vous permettent d'envisager des projets d'avenir. Célibataires, votre sérieux et votre fiabilité attirent une personne en quête de relation durable.",
      argent: "Votre sens de l'économie vous sert particulièrement bien. Un projet d'investissement immobilier ou à long terme pourrait se concrétiser.",
      sante: "Prenez soin de vos articulations aujourd'hui, particulièrement si vous pratiquez une activité physique. Échauffez-vous bien et n'hésitez pas à consulter un spécialiste si des douleurs persistent.",
      travail: "Votre persévérance et votre sens des responsabilités sont reconnus par vos supérieurs. Une promotion ou une augmentation pourrait être à l'horizon.",
      famille: "Vous êtes le pilier sur lequel votre famille peut compter. Votre présence rassurante apporte la sécurité dont vos proches ont besoin."
    },
    mg: {
      amour: "Ny fahatokisan-tena ara-pihetseham-po no mampiavaka ny fiainam-pitiavana anio. Ny fototra matanjaky ny fifandraisana anao dia ahafahanao mirakitra tetikasa ho avy. Mpitady, ny fahamatorana sy ny fahatokisana anao dia mitarika olona iray mitady fifandraisana maharitra.",
      argent: "Tsara indrindra ny toetra tia afa-mihira anao. Mety ho tanteraka ny tetikasa fampiasam-bola trano na maharitra.",
      sante: "Tandremo ny vanin-taolana anio, indrindra raha manao fanatanjahantena ianao. Mifanafana tsara ary aza misalasala ny manatona mpitsabo raha maharitra ny fanaintainana.",
      travail: "Ny fikirizana sy ny fahatsapanao ny andraikitra dia fantatry ny lehibe aminao. Mety ho amin'ny faritan-tany ny fisondrotana na ny fiakaran'ny karama.",
      famille: "Ianao no andry tokony hiankinan'ny fianakavianao. Ny fisiany mahafa-po dia mitondra ny fiarovana ilain'ny havana."
    }
  },
  verseau: {
    fr: {
      amour: "Votre originalité séduit et surprend votre partenaire. Cette journée est idéale pour sortir des sentiers battus et proposer une expérience inédite à votre moitié. Célibataires, votre personnalité unique attire l'attention d'une personne qui partage votre vision du monde.",
      argent: "Une idée novatrice pourrait se transformer en source de revenus. Ne sous-estimez pas la valeur de votre créativité sur le plan financier.",
      sante: "Votre système nerveux mérite une attention particulière. Des techniques de relaxation comme la méditation ou le yoga pourraient vous aider à canaliser votre énergie mentale.",
      travail: "Votre esprit visionnaire impressionne vos collaborateurs. Un projet innovant que vous proposez pourrait révolutionner certaines pratiques dans votre entreprise.",
      famille: "Vous apportez un vent de fraîcheur dans votre cercle familial. Vos idées originales pour les activités en famille sont accueillies avec enthousiasme."
    },
    mg: {
      amour: "Ny originalité anao dia mitaona sy mahagaga ny namanao. Tsara izao andro izao ny hivoahana amin'ny lalana voahitsakitsaka sy hanomezana traikefa vaovao ho an'ny antsasaky ny tenanao. Mpitady, ny maha-tena manokana anao dia mitarika ny saim-panahy mizara ny fomba fijerin'izao tontolo izao.",
      argent: "Mety ho lasa loharanom-bola ny hevitra iray tsy misy. Aza atao tsinontsinona ny hasarobidin'ny famoronanao eo amin'ny lafiny ara-bola.",
      sante: "Mendrika fitandremana manokana ny rafitra nervoa anao. Ny teknika fanalana tension toy ny méditation na ny yoga dia mety hanampy anao hampiasa ny herinao ara-tsaina.",
      travail: "Mahatalanjona ny mpiara-miasa aminao ny fanahinao mahita. Ny tetikasa vaovao atolotrao dia mety hanova ny fomba sasany ao amin'ny orinasanao.",
      famille: "Mampitohy rivotra vaovao ao amin'ny fianakavianao ianao. Ny hevitrao tsy misy toy ny asa atao amin'ny fianakaviana dia raisina amim-pifaliana."
    }
  },
  poissons: {
    fr: {
      amour: "Votre sensibilité et votre intuition vous permettent de comprendre parfaitement les besoins de votre partenaire aujourd'hui. Les couples vivront des moments d'une grande complicité émotionnelle. Célibataires, votre âme romantique pourrait bien rencontrer son alter ego.",
      argent: "Faites confiance à votre intuition concernant une décision financière importante. Votre sixième sens vous guide vers la meilleure option, même si elle semble moins rationnelle.",
      sante: "Votre santé est influencée par votre état émotionnel. Prenez soin de votre équilibre psychique en pratiquant des activités artistiques qui vous permettent d'exprimer vos émotions.",
      travail: "Votre créativité et votre empathie sont vos plus grands atouts professionnels aujourd'hui. Un projet nécessitant imagination et sensibilité pourrait vous être confié.",
      famille: "Vous ressentez intensément les émotions des membres de votre famille. Cette capacité vous permet d'apporter le soutien dont ils ont précisément besoin."
    },
    mg: {
      amour: "Ny fahatsapanao sy ny intuition anao dia ahafahanao mahatakatra tanteraka ny filàn'ny namanao anio. Hiaina fotoana be fiaraha-miasa ara-pihetseham-po ny mpivady. Mpitady, ny fanahy romantique anao dia mety hihaona amin'ny alter ego anao.",
      argent: "Manana fahatokisana ny intuition-nao momba ny fanapahan-kevitra lehibe ara-bola. Ny fahaizanao fahinem dia mitarika anao amin'ny safidy tsara indrindra, na dia toa tsy misy antony aza.",
      sante: "Ny fahasalamanao dia voataona amin'ny toetranao ara-pihetseham-po. Tandremo ny fifandanjana ara-tsaina amin'ny alàlan'ny fampiharana asa artistique izay ahafahan'ny tenanao maneho ny fihetseham-ponao.",
      travail: "Ny famoronanao sy ny empathie no harena lehibe indrindra ho anao anio. Mety homena anao ny tetikasa iray mitaky saina sy fahatsapana.",
      famille: "Mahatsapa mafy ny fihetseham-pon'ny mpianakavy ianao. Io fahaiza-manao io dia ahafahanao manome ny fanohanana ilainy indrindra."
    }
  }
};

// Middleware pour valider le signe
const validateSign = (req, res, next) => {
  const sign = req.params.sign.toLowerCase();
  if (!horoscopes[sign]) {
    return res.status(404).json({ error: 'Signe astrologique non trouvé' });
  }
  next();
};

// Route pour obtenir l'horoscope d'un signe spécifique
router.get('/:sign', validateSign, (req, res) => {
  try {
    const sign = req.params.sign.toLowerCase();
    res.json(horoscopes[sign]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'horoscope:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir tous les signes disponibles
router.get('/', (req, res) => {
  try {
    const signs = Object.keys(horoscopes);
    res.json({ signs });
  } catch (error) {
    console.error('Erreur lors de la récupération des signes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
