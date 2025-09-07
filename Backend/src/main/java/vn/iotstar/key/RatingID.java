package vn.iotstar.key;

import java.io.Serializable;
import java.util.Objects;



public class RatingID implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int applicant;

    private int employer;
    
    @Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof RatingID)) return false;
		RatingID that = (RatingID) o;
		return applicant == that.applicant &&
		       employer == that.employer;
	}

	@Override
	public int hashCode() {
		return Objects.hash(applicant, employer);
	}

}
