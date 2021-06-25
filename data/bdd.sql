-- MySQL dump 10.13  Distrib 8.0.22, for Linux (x86_64)
--
-- Host: localhost    Database: shop
-- ------------------------------------------------------
-- Server version	8.0.25-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- -----------------------------------------------------
-- Schema shop
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `shop` ;

-- -----------------------------------------------------
-- Table `shop`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shop`.`account` (
  `idaccount` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `streetnumber` INT NOT NULL,
  `streetname` VARCHAR(500) NOT NULL,
  `zipcode` INT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `isadmin` TINYINT NULL,
  PRIMARY KEY (`idaccount`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `shop`.`order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shop`.`order` (
  `idorder` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `orderitems` VARCHAR(5000) NOT NULL,
  `total` INT NOT NULL,
  `account_idaccount` INT NOT NULL,
  PRIMARY KEY (`idorder`),
  INDEX `fk_order_account1_idx` (`account_idaccount` ASC) VISIBLE,
  CONSTRAINT `fk_order_account1`
    FOREIGN KEY (`account_idaccount`)
    REFERENCES `shop`.`account` (`idaccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `idproduct` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `shortdescription` varchar(100) NOT NULL,
  `longdescription` varchar(500) NOT NULL,
  `price` int NOT NULL,
  `stock` int NOT NULL,
  `smallurl` varchar(500) NOT NULL,
  `bigurl` varchar(255) NOT NULL,
  `type_idtype` int NOT NULL,
  PRIMARY KEY (`idproduct`),
  KEY `fk_product_type_idx` (`type_idtype`),
  CONSTRAINT `fk_product_type` FOREIGN KEY (`type_idtype`) REFERENCES `type` (`idtype`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Pendentif Saphir','Pendentif saphir bleu rond et diamants 1,30 carats Victoria','Victoria, discret collier serti d\'un saphir bleu de forme ronde de 0,80 carat. La pierre précieuse est entourée de 8 diamants naturels d\'un total de 0,50 carat de qualité G / VS. Fabriqué dans nos ateliers parisiens, le pendentif est disponible en or blanc, jaune et rose de 18 carats.',1500,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxJIb3DU9gCqMMi3TaSlrnaOrzhyEUfFLvF7aI6PCjaaL9jhPG1raNKsTMONI&usqp=CAc','https://cdn.shopify.com/s/files/1/1132/8354/products/2_c67e21a7-2985-4ae4-bc75-38a5e65f12d5_1024x1024.jpg?v=1611763253',1),(2,'Bracelet coquelicot','Bracelet acier imprimé coquelicot','Nostalgique des scènes bucoliques du XIXe siècle ? Partez en visite au musée d’Orsay pour admirer le tableau aux coquelicots peint par Claude Monet. Instant d\'émotion, le bracelet coquelicot Louise\'s Garden prendra alors tout son sens.',70,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9RMgAMhybLfI89zljMUYVUL7fYh0D31Mqa5u1rtrf1JsaIjW54lSPyIcWgr8TUPxirVCHqWb_&usqp=CAc','https://cdn.shopify.com/s/files/1/0332/8435/8203/products/bracelet-coquelicot-bijoux-coquelicot-boheme-chic-louise-garden-MOF2203_1280x1280.jpg?v=1620054677',2),(3,'Bague de fiançaille','Bague roseau or jaune 18 carats, sphère pavée 7 diamants','La délicatesse d\'un anneau tige biseautée, couronné d\'une demi sphère pavée. 7 diamants : 0.12 carats - Or jaune (18 c) : 1.92 g.',500,2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgAXN0M88cpVDDCyxZ18WyNojorq0hsncJfXegeTeuXVeKE4pxGvxqDCrfqoeQIGks0tEktAJY&usqp=CAc','https://img.edenly.com/pt/40/bague-fiancailles-or-jaune-18-carats-diamant__3499955_1.png?_gl=1*lysi93*_gcl_aw*R0NMLjE2MTg5MDczMDkuQ2owS0NRanc5X21EQmhDR0FSSXNBTjNQYUZOM1pWay1VRTQ2WFhEWUxxd0pKb05hWTN4NXJrQnJoejhBODRIb2lBZzdJeXhNLUhUQ2RDY2FBaWU2RUFMd193Y0I.',3),(4,'Sac Chanel','Mini sac à rabat','En cuir de veau irisé et métal doré blanc. Dimensions 12 x 20 x 6 cm',3499,15,'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Chanel_2.55.jpg/160px-Chanel_2.55.jpg','https://upload.wikimedia.org/wikipedia/commons/9/9d/Chanel_2.55.jpg',4),(5,'Portefeuille LV','Portefeuille Clémence rouge','Élégant et compact, le portefeuille Clémence, un classique de la Maison, offre de nombreux détails pratiques. Cette version en toile Monogram iconique est revisitée avec une doublure et une fermeture à glissière en cuir dans des coloris vifs.',388,21,'https://cdn.pixabay.com/photo/2017/05/10/23/08/wallet-2302240__340.jpg','https://cdn.pixabay.com/photo/2017/05/10/23/08/wallet-2302240_960_720.jpg',5),(6,'Jean Diesel','Safado 009EP straight',' Ce pantalon droit est doté d\'une coupe légèrement étroite au niveau des cuisses. La coupe a été réétudiée pour davantage de confort et présente des poches redimensionnées.  Confectionné en denim stretch bleu foncé, ce modèle se caractérise par son effet usé subtil.  98%Coton, 2%Élasthanne Straight, Fermeture boutonnée, Stretch, Medium treated, Bleu foncé',130,8,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMgr_R7Sj2E5fxMw_T1X5c9uGn9uj-tiHHVMm4EuDrGWwIlkPy3bV34u-AAIgMHDnoGTKys8IZ&usqp=CAc','https://fr.diesel.com/on/demandware.static/-/Sites-diesel-master-catalog/default/dw4455f012/images/large/00S0PS_009EP_01_C.jpg',6),(7,'Tunique Mango','Tunique semi-transparente Saladeta avec imprimé et lurex','Composition • lavage: Maximum à 30° C • Repassage: Repasser à chaud (max. 110° C) • Séchage: Ne pas mettre au sèche-linge • Matériau: 100 % polyester • Modèle: Imprimé • Nettoyage chimique: Nettoyage à sec par pressing • Stretch: Matériau d\'épaisseur moyenne sans stretch • Tissu: Fil brillant, Semi-transparant Caractéristiques • Encolure: Col montant • Longueur des manches: Manche longue Coupe • Coupe: Silhouette droite ample',18,5,'https://cdn-1.debijenkorf.fr/web_detail_2x/mango-tunique-semi-transparente-saladeta-avec-imprime-et-lurex/?reference=013/200/13_0132006712200000_pro_mod_frt_02_1108_1528_4851289.jpg','https://cdn-1.debijenkorf.fr/web_detail_2x/mango-tunique-semi-transparente-saladeta-avec-imprime-et-lurex/?reference=013/200/13_0132006712200000_pro_mod_det_01_1108_1528_4851287.jpg',7),(8,'Robe de soirée','Robe noire et blanche, coupe évasée, col rond','Cette robe est réalisée sur commande. Que vous choisissiez une taille standard ou des mesures personnalisées, votre robe sera confectionnée dès réception de votre commande par nos couturiers. Plusieurs coloris disponible.',149,18,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9UXDuMGspCXS2C9a1s4JdA0STZKqQorPZC7royWeEuq9So7_vh435E6cUOMsSlQlTBzIriDI&usqp=CAc','https://cdn-1.jjshouse.com/upimg/jjshouse/o600/e2/b4/86e7744d8d610806e4f4130a4a60e2b4.jpg',8);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `idtype` int NOT NULL AUTO_INCREMENT,
  `typename` varchar(45) NOT NULL,
  `typegroup_idtypegroup` int NOT NULL,
  PRIMARY KEY (`idtype`),
  KEY `fk_type_typegroup1_idx` (`typegroup_idtypegroup`),
  CONSTRAINT `fk_type_typegroup1` FOREIGN KEY (`typegroup_idtypegroup`) REFERENCES `typegroup` (`idtypegroup`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'Collier',1),(2,'Bracelet',1),(3,'Bague',1),(4,'Sac',2),(5,'Portefeuille',2),(6,'Pantalon',3),(7,'Tunique',3),(8,'Robe',3);
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `typegroup`
--

DROP TABLE IF EXISTS `typegroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `typegroup` (
  `idtypegroup` int NOT NULL AUTO_INCREMENT,
  `groupname` varchar(45) NOT NULL,
  PRIMARY KEY (`idtypegroup`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `typegroup`
--

LOCK TABLES `typegroup` WRITE;
/*!40000 ALTER TABLE `typegroup` DISABLE KEYS */;
INSERT INTO `typegroup` VALUES (1,'Bijoux'),(2,'Maroquinerie'),(3,'Prêt-à-porter');
/*!40000 ALTER TABLE `typegroup` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-25 11:22:51