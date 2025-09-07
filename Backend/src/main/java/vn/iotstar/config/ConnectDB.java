package vn.iotstar.config;

import jakarta.persistence.*;

@PersistenceContext
public class ConnectDB {
	 public static EntityManager getEntityManager() {
		 EntityManagerFactory factory = Persistence.createEntityManagerFactory("jpa-hibernate-sql");
		 return factory.createEntityManager();
	 }

}
