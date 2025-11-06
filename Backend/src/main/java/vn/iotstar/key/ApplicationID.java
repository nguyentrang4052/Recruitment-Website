package vn.iotstar.key;

import java.io.Serializable;
import java.util.Objects;

public class ApplicationID implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private int recruitmentNews;
	
	private int applicant;
	
	 @Override
		public boolean equals(Object o) {
			if (this == o) return true;
			if (!(o instanceof ApplicationID)) return false;
			ApplicationID that = (ApplicationID) o;
			return applicant == that.applicant &&
					recruitmentNews == that.recruitmentNews;
		}

		@Override
		public int hashCode() {
			return Objects.hash(applicant, recruitmentNews);
		}
	

}
